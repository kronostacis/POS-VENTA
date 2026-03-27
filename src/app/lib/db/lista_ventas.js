import prisma from "@/app/lib/prisma";

export async function getAllSales() {
  const q = await prisma.Ventas.findMany({
    select: {
      Id_venta: true,
      Id_pago: true,
      Total_venta: true,
      Fecha_venta: true,
      Id_usuario: true,
      Utilidad_total: true,
      Id_estado_venta: true,
      Detalle_ventas_productos: true,
      Estado_ventas: true,
      Medio_pagos: true,
      Usuarios: true,
    },
    orderBy: { Fecha_venta: "desc" },
  });

  return q;
}

export async function getSaleById(id) {
  const q = await prisma.Ventas.findUnique({
    where: { Id_venta: id },
    select: {
      Id_venta: true,
      Id_pago: true,
      Total_venta: true,
      Fecha_venta: true,
      Id_usuario: true,
      Utilidad_total: true,
      Id_estado_venta: true,
      Detalle_ventas_productos: true,
      Estado_ventas: true,
      Medio_pagos: true,
      Usuarios: true,
    },
  });

  return q;
}

/*
export async function getDetailSale(id) {
  const q = await prisma.Detalle_ventas_productos.findMany({
    where: { Id_venta: id },
    select: {
      Id_producto: true,
      Cantidad: true,
      Precio_total: true,
    },
  });

  return q;
}*/

export async function getDetailSale(idVenta) {
  return await prisma.detalle_ventas_productos.findMany({
    where: { Id_venta: idVenta },
    select: {
      Cantidad: true,
      Precio_total: true,
      Productos: {      // incluir la relación Productos
        select: {
          Nombre: true, // solo traemos el nombre del producto
        },
      },
    },
  });
}