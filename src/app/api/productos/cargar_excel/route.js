import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "El formato de datos no es válido o está vacío." },
        { status: 400 }
      );
    }

    // Usamos transacción para asegurar que todo se inserta correctamente o se revierte
    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener el último ID de producto para ir incrementándolo
      const ultimoProducto = await tx.productos.findFirst({
        orderBy: { Id_producto: "desc" },
      });

      let nextId = ultimoProducto ? ultimoProducto.Id_producto + 1 : 1;
      let productosInsertados = 0;

      for (const item of data) {
        // Validación básica de columnas
        if (
          !item.Nombre ||
          item.Precio_venta == null ||
          item.Precio_compra == null ||
          item.Cantidad == null
        ) {
          throw new Error(
            `Faltan datos obligatorios para el producto: ${item.Nombre || "Desconocido"}`
          );
        }

        // Crear producto
        const nuevoProducto = await tx.productos.create({
          data: {
            Id_producto: nextId,
            Nombre: String(item.Nombre),
            Precio_venta: parseFloat(item.Precio_venta),
            Stock: parseInt(item.Cantidad, 10), // Stock en tabla producto (aunque sea inicial) o cero (dependiendo de la lóg de la app, aquí ponemos lo que trae el lote)
          },
        });

        // Crear su lote correspondiente
        await tx.lote_productos.create({
          data: {
            Id_producto: nextId,
            Precio_compra: parseFloat(item.Precio_compra),
            Cantidad: parseInt(item.Cantidad, 10),
            Stock: parseInt(item.Cantidad, 10), // Mismo stock inicial
            Fecha: new Date(),
          },
        });

        nextId++;
        productosInsertados++;
      }

      return { numInserted: productosInsertados };
    });

    return NextResponse.json(
      {
        message: "Carga masiva completada correctamente",
        insertados: result.numInserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en carga masiva de productos:", error);
    return NextResponse.json(
      { message: error.message || "Ocurrió un error en la carga masiva" },
      { status: 500 }
    );
  }
}
