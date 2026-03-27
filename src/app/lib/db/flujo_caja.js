import prisma from "@/app/lib/prisma";

export async function getIngress(from, to) {
  const result = await prisma.Ventas.aggregate({
    _sum: {
      Total_venta: true,
    },
    where: {
      Fecha_venta: {
        gte: new Date(from), // greater than or equal to 'from'
        lte: new Date(to),   // less than or equal to 'to'
      },
    },
  });

  return result._sum.Total_venta ?? 0;
}

export async function getEgress(from, to) {
  const productos = await prisma.Lote_productos.findMany({
    where: {
      Fecha: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
    select: {
      Precio_compra: true,
      Cantidad: true,
    },
  });

  // Sumar Precio_compra * Cantidad por cada producto
  const total = productos.reduce((acc, producto) => {
    return acc + (producto.Precio_compra * producto.Cantidad);
  }, 0);

  return total;
}


export async function getUtility(from, to) {
  const result = await prisma.Ventas.aggregate({
    _sum: {
      Utilidad_total: true,
    },
    where: {
      Fecha_venta: {
        gte: new Date(from), // greater than or equal to 'from'
        lte: new Date(to),   // less than or equal to 'to'
      },
    },
  });

  return result._sum.Utilidad_total ?? 0;
}


export async function getInventory() {
  const productos = await prisma.Lote_productos.findMany({
    select: {
      Precio_compra: true,
      Stock: true,
    },
  });

  // Sumar Precio_compra * Cantidad por cada producto
  const total = productos.reduce((acc, producto) => {
    return acc + (producto.Precio_compra * producto.Stock);
  }, 0);

  return total;
}

export async function getCaja() {
    const ingresos = await prisma.Ventas.aggregate({
    _sum: {
      Total_venta: true,
    },
  });

  return ingresos._sum.Total_venta;
}