// /api/productos/route.js

import { NextResponse } from "next/server";
import { addProduct, getAllProducts } from "@/app/lib/db/productos";
import { CreateProductSchema } from "@/validations/productSchema";
import { getUserFromToken } from "@/app/lib/auth";

export async function GET() {
  try {
    const productos = await getAllProducts();
    return NextResponse.json(productos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = await getUserFromToken();
    if (!authUser || (authUser.cargo !== 1 && authUser.cargo !== 2)) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 });
    }

    const data = await request.json();

    await CreateProductSchema.validate(data, { abortEarly: false });

    const nuevoProducto = await addProduct(data);

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json({ message: "Datos inválidos", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Error al agregar producto" }, { status: 500 });
  }
}
