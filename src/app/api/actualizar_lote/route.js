import { NextResponse } from "next/server";
import { updateStockByLoteId } from "@/app/lib/db/realizar_venta"; // Asumiendo que tienes esta función en tu capa de datos

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json(); // Espera un JSON con el nuevo stock

    const { cantidad } = body;

    if (typeof cantidad !== "number") {
      return NextResponse.json(
        { success: false, message: "Cantidad inválida" },
        { status: 400 }
      );
    }

    const result = await updateStockByLoteId(id, cantidad);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Stock no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Stock actualizado correctamente", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al modificar stock:", error);
    return NextResponse.json(
      { success: false, message: "Error al modificar stock" },
      { status: 500 }
    );
  }
}