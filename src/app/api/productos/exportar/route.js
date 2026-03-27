import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const productos = await prisma.productos.findMany({
      orderBy: { Nombre: "asc" },
    });

    // Generar CSV con BOM para Excel
    const BOM = "\uFEFF";
    const headers = ["ID", "Nombre", "Precio Venta", "Stock"];
    const csvRows = [headers.join(",")];

    for (const p of productos) {
      csvRows.push([
        p.Id_producto,
        `"${(p.Nombre || "").replace(/"/g, '""')}"`,
        Number(p.Precio_venta ?? 0),
        p.Stock ?? 0,
      ].join(","));
    }

    const csvContent = BOM + csvRows.join("\n");
    const today = new Date().toISOString().split("T")[0];

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="productos_${today}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error al exportar productos:", error);
    return NextResponse.json(
      { error: "Error al exportar productos" },
      { status: 500 }
    );
  }
}
