import { updateMedio_pagoStateById } from "@/app/lib/db/medio_pago";
import { NextResponse } from "next/server";
export async function PUT(request, { params }) {
  const { id } = await params;
  const pagoId = parseInt(id);

  try {
    const data = await request.json();
    const { Id_estado_medio_pago } = data;

    // Validate the input
    if (typeof Id_estado_usuario !== "number") {
      return NextResponse.json(
        { success: false, message: "Id_estado_usuario debe ser un número" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updateState = await updateMedio_pagoStateById(pagoId, Id_estado_medio_pago);

    return NextResponse.json(updateState, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al actualizar el estado del medio de pago:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar el estado del medio de pago" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}