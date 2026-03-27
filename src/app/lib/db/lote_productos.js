import prisma from "@/app/lib/prisma";

export async function getAllLotes() {
  const q = await prisma.lote_productos.findMany({
    select: {
      Id_lote: true,
      Id_producto: true,
      Precio_compra: true,
      Cantidad: true,
      Stock: true,
      Fecha: true,
    },
  });

  return q;
}

export async function addLotes(data) {
  try {
    const productoExiste = await prisma.productos.findUnique({
      where: { Id_producto: parseInt(data.Id_producto) },
    });

    if (!productoExiste) {
      throw new Error("El producto no existe.");
    }

    const lote = await prisma.lote_productos.create({
      data: {
        Id_producto: parseInt(data.Id_producto),
        Precio_compra: parseFloat(data.Precio_compra),
        Cantidad: parseInt(data.Cantidad),
        Stock: parseInt(data.Cantidad), // Stock inicial = Cantidad
        Fecha: data.Fecha ? new Date(data.Fecha) : new Date(),
      },
    });

    return lote;
  } catch (error) {
    console.error("Error en addLotes:", error);
    throw error;
  }
}


export async function getLoteById(id) {
  try {
    const lote = await prisma.lote_productos.findUnique({
      where: { Id_lote: id },
    });
    return lote;
  } catch (error) {
    console.error("Error getLoteById:", error);
    return null;
  }
}

export async function updateLoteById(id, data) {
  try {
    // Obtener el lote actual
    console.log("ID lote:",id);
    console.log("data lote:",data);
    
    const loteExistente = await prisma.lote_productos.findUnique({
      where: { Id_lote: id },
    });

    if (!loteExistente) {
      return { success: false, message: "Lote no encontrado" };
    }

    // Validar que Stock no sea mayor que Cantidad
    if (data.Stock > loteExistente.Cantidad) {
      return {
        success: false,
        message: `El stock (${data.Stock}) no puede ser mayor que la cantidad total del lote (${loteExistente.Cantidad}).`,
      };
    }

    // Actualizar el lote
    const loteActualizado = await prisma.lote_productos.update({
      where: { Id_lote: id },
      data: {
        Stock: data.Stock,
      },
    });

    return { success: true, lote: loteActualizado };
  } catch (error) {
    console.error("Error updateLoteById:", error);
    return { success: false, message: "No se pudo actualizar el lote" };
  }
}


export async function deleteLoteById(id) {
  try {
    const user = await prisma.lote_productos.delete({
      where: {
        Id_lote: id,
      },
    });
    return { success: true, user: user };
  } catch (error) {
    return { success: false, message: "No se pudo eliminar el lote" };
  }
}

