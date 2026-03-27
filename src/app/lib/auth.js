// lib/auth.js
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getUserById } from "@/app/lib/db/usuarios";
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    const userId = payload.id;

    if (!userId) return null;

    const user = await getUserById(userId);
    if (user) {
      return { id: user.Id_usuario, cargo: user.Cargo };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    return null;
  }
}

export function getRoleFromUser(user) {
  return user?.role ?? null;
}
