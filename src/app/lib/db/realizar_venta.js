import prisma from "@/app/lib/prisma";

export async function getProductbyID(id) {
  const product = await prisma.productos.findUnique({
    where: { Id_producto: id },
    select: {
      Id_producto: true,
      Nombre: true,
      Precio_venta: true,
      Stock: true,
    },
  });

  return product;
}

export async function getAllPayMethods() {
  const q = await prisma.medio_pagos.findMany({
    select: {
      Id_pago: true,
      Nombre_pago: true,
      Estado_medios_pago: true,
    },
  });

  return q;
}

export async function newSale(data) {
  const { Id_pago, Total_venta, Id_usuario, Utilidad_total, Id_estado_venta } =
    data;
  
  const ultimo = await prisma.ventas.findFirst({
    orderBy: { Id_venta: "desc" }
  });

  const nuevoId = ultimo ? ultimo.Id_venta + 1 : 1;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  const parts = formatter.formatToParts(new Date());
  const p = {}; parts.forEach(part => p[part.type] = part.value);
  const chileDateAsUTC = new Date(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.000Z`);

  const venta = await prisma.ventas.create({
    data: {
      Id_venta: nuevoId,
      Id_pago,
      Total_venta,
      Id_usuario,
      Utilidad_total,
      Id_estado_venta,
      Fecha_venta: chileDateAsUTC,
    },
  });

  return venta;
}

export async function newDetailSale(data) {
  const { Id_venta, Id_producto, Cantidad, Precio_total} =
    data;

  const detail = await prisma.detalle_ventas_productos.create({
    data: {
      Id_venta,
      Id_producto,
      Cantidad,
      Precio_total,
    },
  });

  return detail;
}

export async function getAllLoteByProduct(id) {
  const q = await prisma.lote_productos.findMany({
    where: {
      Id_producto: id,
      Stock: {
        gt: 0, // "greater than 0"
      },
    },
    orderBy: {
      Fecha: 'asc', // más antiguo primero
    },
    select: {
      Id_lote: true,
      Precio_compra: true,
      Stock: true,
      Fecha: true,
      Cantidad: true,
    },
  });

  return q;
}

export async function updateStockByLoteId(id, data) {
  try {
    const lote = await prisma.lote_productos.update({
      where: { Id_lote: id },
      data: {
        Stock: data.Stock,
      },
    });

    return { success: true, lote: lote };
  } catch (error_) {
    console.log(error_);
    return { success: false, message: "No se pudo actualizar el Stock." };
  }
}

