import { UpdateUserSchema } from "@/validations/userSchema";
import { NextResponse } from "next/server";
import {
  getUserById,
  deleteUserById,
  updateUserById,
} from "@/app/lib/db/usuarios";
import { getUserFromToken } from "@/app/lib/auth";

// GET: Obtener usuario por ID
export async function GET(request, context) {
  const authUser = await getUserFromToken();
  if (!authUser || (authUser.cargo !== 1 && authUser.cargo !== 2)) {
    return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id);
  
  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar usuario por ID
export async function DELETE(request, context) {
  const authUser = await getUserFromToken();
  if (!authUser || (authUser.cargo !== 1 && authUser.cargo !== 2)) {
    return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id);

  try {
    await deleteUserById(userId);
    return NextResponse.json(
      { success: true, message: "Usuario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar usuario por ID
export async function PUT(request, context) {
  const authUser = await getUserFromToken();
  if (!authUser || (authUser.cargo !== 1 && authUser.cargo !== 2)) {
    return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id);

  try {
    const data = await request.json();

    await UpdateUserSchema.validate(data, {
      abortEarly: false,
    });

    const updatedUser = await updateUserById(userId, data);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar usuario", error },
      { status: 400 }
    );
  }
}
