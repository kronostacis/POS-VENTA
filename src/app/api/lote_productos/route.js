// /api/productos/route.js

import { NextResponse } from "next/server";
import { addLotes, getAllLotes } from "@/app/lib/db/lote_productos";
import { CreateLoteSchema } from "@/validations/loteSchema";

export async function GET() {
  try {
    const lotes = await getAllLotes();
    return NextResponse.json(lotes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener lotes de productos" }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const data = await request.json();

    await CreateLoteSchema.validate(data, { abortEarly: false });

    const nuevoLote = await addLotes(data);  // <-- aquí ocurre el error

    return NextResponse.json(nuevoLote, { status: 201 });
  } catch (error) {
    console.error(error); // Asegúrate de ver esto en consola
    if (error.name === "ValidationError") {
      return NextResponse.json({ message: "Datos inválidos", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Error al agregar en lote de producto" }, { status: 500 });
  }
}
