import jwt from "jsonwebtoken";
import { query } from "@/app/lib/connection";
import argon2 from "argon2";
import { serialize } from "cookie";

export async function POST(request) {
  const body = await request.json();

  try {
    // 1. Verificar usuario en la base de datos
    const q = await query(
      "SELECT Id_usuario, Nombre, Apellido_1, Cargo, Contrasena, Id_estado_usuario FROM Usuarios WHERE Id_usuario = ?",
      [body.user]
    );

    if (q.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = q[0];

    // 2. Verificar contraseña con Argon2
    const passwordMatch = await argon2.verify(user.Contrasena, body.password);

    if (user.Id_estado_usuario !== 1) {
      return new Response(
        JSON.stringify({ success: false, message: "Credenciales Invalidas" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ success: false, message: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Generar tokens JWT
    const accessToken = jwt.sign(
      {
        id: user.Id_usuario,
        name: user.Nombre,
        lastName: user.Apellido_1,
        role: user.Cargo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.Id_usuario,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Configurar cookies seguras
    const accessTokenCookie = serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hora
      path: "/",
    });

    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    // 5. Devolver respuesta con cookies
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.Id_usuario,
          name: user.Nombre,
          lastName: user.Apellido_1,
          role: user.Cargo,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `${accessTokenCookie}, ${refreshTokenCookie}`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error en el servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
