import { NextResponse } from "next/server";
import {
  getLoteById,
  updateLoteById,
  deleteLoteById,
} from "@/app/lib/db/lote_productos";
import { UpdateLoteSchema } from "@/validations/loteSchema";

// OBTENER LOTE POR ID
export async function GET(req, { params }) {
  const id = parseInt(params.id);

  const lote = await getLoteById(id);

  if (!lote) {
    return NextResponse.json(
      { success: false, message: "Lote no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(lote);
}

// ACTUALIZAR STOCK DEL LOTE
export async function PUT(request, context ) {
  try {
    var { id } = await context.params;
    id = parseInt(id);
    const data = await request.json();
    console.log("DAta ahora:",data);

    await UpdateLoteSchema.validate(data, { abortEarly: false });
    console.log("Aquiiiiii");

    const result = await updateLoteById(id, data);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Datos inválidos", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error en PUT /lote:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar lote" },
      { status: 500 }
    );
  }
}

// ELIMINAR LOTE
export async function DELETE(req, { params }) {
  const id = parseInt(params.id);

  const result = await deleteLoteById(id);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Lote eliminado" });
}