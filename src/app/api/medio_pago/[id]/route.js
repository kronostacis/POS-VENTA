// realizar modificicacion, eliminar, etc
import { UpdateMedio_pagosSchema } from "@/validations/Medio_pagosSchema";
import { NextResponse } from "next/server";
import {
  getMedio_pagoById,
  deleteMedio_PagoById,
  updateMedio_PagoById,
} from "@/app/lib/db/medio_pago";

export async function GET(request, context) {
  const { id } = await context.params;
  const medioPagoId = parseInt(id);

  try {
    const medioPago = await getMedio_pagoById(medioPagoId);
    if (!medioPago) {
      return NextResponse.json(
        { success: false, message: "Medio de pago no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(medioPago, { status: 200 });
  } catch (error) {
    console.error("Error al obtener medio de pago:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener medio de pago" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const Medio_pago_Id = parseInt(id);

  try {
    deleteMedio_PagoById(Medio_pago_Id);
    return NextResponse.json(
      { success: true, message: "Medio de pago eliminado correctamente" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error al eliminar medio de pago:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar medio de pago" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const Medio_pago_Id = parseInt(id);
    const data = await request.json();

    await UpdateMedio_pagosSchema.validate(data, {
      abortEarly: false,
    });

    const updatedMedioPago = await updateMedio_PagoById(Medio_pago_Id, data);
    return NextResponse.json(updatedMedioPago, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (errors) {
    return NextResponse.json(
      { success: false, message: "Error al actualizar medio de pagos", errors },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
