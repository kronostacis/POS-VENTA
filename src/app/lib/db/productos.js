import prisma from "@/app/lib/prisma";

export async function getAllProducts() {
  const q = await prisma.productos.findMany({
    select: {
      Id_producto: true,
      Nombre: true,
      Precio_venta: true,
      Stock: true,
    },
  });

  return q;
}

export async function addProduct(data) {
    // Obtener el último Id_producto
    const ultimo = await prisma.productos.findFirst({
      orderBy: { Id_producto: "desc" },
    });
  
    const nuevoId = ultimo ? ultimo.Id_producto + 1 : 1;
  
    // Insertar con el nuevo Id_producto
    const producto = await prisma.productos.create({
      data: {
        Id_producto: nuevoId,
        Nombre: data.Nombre,
        Precio_venta: data.Precio_venta,
        Stock:0,
      },
    });
  
    return producto;
  }
  

export async function getProductById(id) {
  const id_int = parseInt(id)
  const user = await prisma.productos.findUnique({
    where: { Id_producto: id_int },
    select: {
      Id_producto: true,
      Nombre: true,
      Precio_venta: true,
      Stock: true,
    },
  });

  return user;
}

export async function productExist(id) {
  const user = await prisma.productos.findUnique({
    where: { Id_producto: id },
    select: {
      Id_producto: true,
    },
  });

  return user;
}

export async function getProductHashById(id) {
  const user = await prisma.productos.findUnique({
    where: { Id_producto: id },
    select: {
      Id_producto: true,
      Nombre: true,
      Stock: true,
      Precio_venta: true,
    },
  });

  return user;
}

export async function deleteProductById(id) {
  try {
    const user = await prisma.productos.delete({
      where: {
        Id_producto: id,
      },
    });
    return { success: true, user: user };
  } catch (error) {
    return { success: false, message: "No se pudo eliminar el producto" };
  }
}

export async function updateProductById(id, data) {
  try {
    const { Id_producto, Nombre, Precio_venta} =
      data;
    const user = await prisma.productos.update({
      where: { Id_producto: id },
      data: {
        Nombre: data.Nombre,
        Precio_venta: data.Precio_venta,
      },
    });

    return { success: true, user: user };
  } catch (errors) {
    console.log(errors);
    return { success: false, message: "No se pudo actualizar el producto" };
  }
}

