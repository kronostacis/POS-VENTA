import { NextResponse } from "next/server";
import { getAllLoteByProduct } from "@/app/lib/db/realizar_venta"; // Ajusta la ruta si tu función está en otro archivo

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    // Validación básica
    if (!id) {
      return NextResponse.json({ error: "Falta el ID del producto" }, { status: 400 });
    }

    const lotes = await getAllLoteByProduct(Number(id)); // Asegúrate de convertir a número si es necesario

    return NextResponse.json(lotes, { status: 200 });
  } catch (error) {
    console.error("Error al obtener lotes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}