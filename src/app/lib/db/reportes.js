import prisma from "@/app/lib/prisma";

// ventas diarias (días de un mes/año específico)
export async function obtenerVentasDiarias(month, year) {
  // Fetch with a margin to account for timezone differences (UTC vs Santiago)
  const startDate = new Date(Date.UTC(year, month - 1, -3));
  const endDate = new Date(Date.UTC(year, month, 3));

  const ventas = await prisma.ventas.findMany({
    where: {
      Fecha_venta: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { Fecha_venta: true, Total_venta: true },
  });

  const map = new Map();
  for (const venta of ventas) {
    // Convert to YYYY-MM-DD strictly in Chilean time
    const dString = new Date(venta.Fecha_venta).toLocaleString("en-CA", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [vYear, vMonth, vDay] = dString.split("-").map(Number);

    if (vYear === year && vMonth === month) {
      map.set(vDay, (map.get(vDay) || 0) + Number(venta.Total_venta));
    }
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    fecha: `${i + 1}`,
    total: map.get(i + 1) || 0,
  }));
}

// Ventas mensuales (12 meses de un año específico)
export async function obtenerVentasMensuales(year) {
  // Fetch with a margin to account for timezone differences
  const startDate = new Date(Date.UTC(year, 0, -5));
  const endDate = new Date(Date.UTC(year + 1, 0, 5));

  const ventas = await prisma.ventas.findMany({
    where: {
      Fecha_venta: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { Fecha_venta: true, Total_venta: true },
  });

  const map = new Map();
  for (const venta of ventas) {
    const dString = new Date(venta.Fecha_venta).toLocaleString("en-CA", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [vYear, vMonth] = dString.split("-").map(Number);

    if (vYear === year) {
      map.set(vMonth, (map.get(vMonth) || 0) + Number(venta.Total_venta));
    }
  }

  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  return meses.map((nombre, i) => ({
    Mes: nombre,
    Total: map.get(i + 1) || 0,
  }));
}

// Ventas por medio de pago
export async function obtenerVentasPorPago() {
  const agrupadas = await prisma.ventas.groupBy({
    by: ["Id_pago"],
    _sum: { Total_venta: true },
  });

  const pagos = await prisma.medio_pagos.findMany({
    select: { Id_pago: true, Nombre_pago: true },
  });

  const nombreMap = Object.fromEntries(pagos.map(p => [p.Id_pago, p.Nombre_pago]));

  return agrupadas.map(p => ({
    metodo: nombreMap[p.Id_pago] ?? `Pago ${p.Id_pago}`,
    total: Number(p._sum.Total_venta ?? 0),
  }));
}