import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");
    const usuario = searchParams.get("usuario");

    // Construir filtro dinámico
    const where = {};

    if (desde || hasta) {
      where.Fecha_venta = {};
      if (desde) where.Fecha_venta.gte = new Date(`${desde}T00:00:00`);
      if (hasta) where.Fecha_venta.lte = new Date(`${hasta}T23:59:59`);
    }

    if (usuario) {
      const user = await prisma.usuarios.findFirst({
        where: { Nombre: usuario },
        select: { Id_usuario: true },
      });
      if (user) where.Id_usuario = user.Id_usuario;
    }

    const ventas = await prisma.ventas.findMany({
      where,
      include: {
        Medio_pagos: true,
        Usuarios: true,
        Estado_ventas: true,
      },
      orderBy: { Fecha_venta: "desc" },
    });

    // Generar CSV con BOM para que Excel lo abra correctamente en español
    const BOM = "\uFEFF";
    const headers = ["ID Venta", "Fecha", "Vendedor", "Medio de Pago", "Estado", "Total Venta"];
    const csvRows = [headers.join(",")];

    for (const venta of ventas) {
      const fecha = new Date(venta.Fecha_venta).toLocaleString("es-CL", {
        timeZone: "America/Santiago",
        dateStyle: "short",
        timeStyle: "short",
      });
      const row = [
        venta.Id_venta,
        `"${fecha}"`,
        `"${venta.Usuarios?.Nombre || ""}"`,
        `"${venta.Medio_pagos?.Nombre_pago || ""}"`,
        `"${venta.Estado_ventas?.Nombre_estado_venta || ""}"`,
        Number(venta.Total_venta ?? 0),
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = BOM + csvRows.join("\n");

    // Nombre del archivo
    const today = new Date().toISOString().split("T")[0];
    let filename = `ventas_${today}`;
    if (desde && hasta) {
      filename = `ventas_${desde}_a_${hasta}`;
    } else if (desde) {
      filename = `ventas_desde_${desde}`;
    } else if (hasta) {
      filename = `ventas_hasta_${hasta}`;
    }
    if (usuario) {
      filename += `_${usuario.replace(/\s+/g, "_")}`;
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error al exportar ventas:", error);
    return NextResponse.json(
      { error: "Error al exportar ventas" },
      { status: 500 }
    );
  }
}
