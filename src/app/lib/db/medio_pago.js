import prisma from "@/app/lib/prisma";

export async function getAllMedio_pago() {
  const q = await prisma.Medio_pagos.findMany({
    select: {
        Id_pago: true,
        Nombre_pago: true,
    },
  });

  return q;
}

export async function getMedio_pagoById(id) {
  const medioPago = await prisma.Medio_pagos.findUnique({
    where: {
      Id_pago: id,
    },
    select: {
      Id_pago: true,
      Nombre_pago: true,
    },
  });
  return medioPago;
}

export async function createMedio_pago(data) {
  const { Nombre_pago} =
    data;

  const Medio_pago = await prisma.Medio_pagos.create({
    data: {
        Nombre_pago,      
    },
  });

  return Medio_pago;
}

export async function deleteMedio_PagoById(id) {
  try {
    const Medio_pago = await prisma.Medio_pagos.delete({
      where: {
        Id_pago: id,
      },
    });
    return { success: true, Medio_pago: Medio_pago };
  } catch (error) {
    return { success: false, message: "No se pudo eliminar el metodo de pago" };
  }
}

export async function updateMedio_PagoById(id, data) {
  try {
    const {Id_pago, Nombre_pago} = data;
    const Medio_pago = await prisma.Medio_pagos.update({
      where: { Id_pago: id },
      data:{ Nombre_pago: data.Nombre_pago,
      },
    });
    return { success: true, Medio_pago: Medio_pago };
  } catch (error) {
    console.log(errors);
    return { success: false, message: "No se pudo modificar el metodo de pago" };
  }
}

export async function updateMedio_pagoStateById(id, state) {
  try {
    const Medio_pago = await prisma.Medio_pagos.update({
      where: { Id_pago: id },
      data: { Id_estado_medio_pago: state },
    });

    return { success: true, Medio_pago: Medio_pago };
  } catch (error) {
    console.error("Error al actualizar el estado del medio de pago:", error);
    return {
      success: false,
      message: "No se pudo actualizar el estado del medio de pago",
    };
  }
}