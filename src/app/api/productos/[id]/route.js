// modificar y eliminar productos
import { UpdateProductSchema } from "@/validations/productSchema";
import { NextResponse } from "next/server";
import {getProductById,updateProductById,deleteProductById} from "@/app/lib/db/productos";
import { getUserFromToken } from "@/app/lib/auth";

export async function GET(req, context) {
    const { id } = await context.params;
    console.log(id);

    const producto = await getProductById(id);
  
    if (!producto) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }
  
    return NextResponse.json(producto);
  }
  
  // ACTUALIZAR PRODUCTO POR ID
  export async function PUT(request, { params }) {
    try {
      const authUser = await getUserFromToken();
      if (!authUser || (authUser.cargo !== 1 && authUser.cargo !== 2)) {
        return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 });
      }

      const id = parseInt(params.id);
      const data = await request.json();
  
      await UpdateProductSchema.validate(data, { abortEarly: false });
  
      const result = await updateProductById(id, data);
  
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
  
      return NextResponse.json(result.user, { status: 200 });
    } catch (error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { success: false, message: "Datos inválidos", errors: error.errors },
          { status: 400 }
        );
      }
  
      return NextResponse.json({ success: false, message: "Error al actualizar producto" }, { status: 500 });
    }
  }
  
  
  // ELIMINAR PRODUCTO POR ID
  export async function DELETE(req, { params }) {
    const authUser = await getUserFromToken();
    if (!authUser || (authUser.cargo !== 1 && authUser.cargo !== 2)) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 });
    }

    const id = parseInt(params.id);
  
    const result = await deleteProductById(id);
  
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  
    return NextResponse.json({ success: true, message: "Producto eliminado" });
  }