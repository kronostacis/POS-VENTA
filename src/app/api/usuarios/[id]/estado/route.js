import { updateUserStateById } from "@/app/lib/db/usuarios";
import { NextResponse } from "next/server";
export async function PUT(request, { params }) {
  const { id } = await params;
  const userId = parseInt(id);

  try {
    const data = await request.json();
    const { Id_estado_usuario } = data;

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

    const updateState = await updateUserStateById(userId, Id_estado_usuario);

    return NextResponse.json(updateState, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al actualizar el estado del usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar el estado del usuario" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
