import { NextResponse } from "next/server";
import { ChangePasswordSchema } from "@/validations/userSchema";
import jwt from "jsonwebtoken";
import {
  getUserHashById,
  updatePasswordUserById,
  userExist,
} from "@/app/lib/db/usuarios";
import argon2 from "argon2";
import { cookies } from "next/headers";

export async function PUT(request, context) {
  try {
    var { id } = await context.params;
    id = parseInt(id);

    const body = await request.json();
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");
    const accessToken = accessTokenCookie?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const tokenId = decodedToken.id;

    if (tokenId != parseInt(id))
      return NextResponse.json({ error: "No autorizado 1" }, { status: 401 });

    // Validar esquema
    try {
      await ChangePasswordSchema.validate(body, { abortEarly: false });
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Datos de entrada inválidos",
          details: validationError.errors,
        },
        { status: 400 }
      );
    }

    // Obtener usuario
    const userRecord = await getUserHashById(tokenId);
    if (!userRecord) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const { Contrasena, Nueva_contrasena } = body;

    // Verificar contraseña actual
    let passwordMatch = false;
    try {
      passwordMatch = await argon2.verify(userRecord.Contrasena, Contrasena);
    } catch (verifyError) {
      console.error("Error al verificar contraseña:", verifyError);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta" },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const hashedNewPassword = await argon2.hash(Nueva_contrasena, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
      hashLength: 64,
    });

    // Actualizar contraseña
    const updatedUser = await updatePasswordUserById(tokenId, {
      Contrasena: hashedNewPassword,
    });

    return NextResponse.json(
      { message: "Contraseña cambiada exitosamente", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error general:", error);

    // Manejo específico de errores JWT
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Token expirado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
