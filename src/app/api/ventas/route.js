// ver todas las ventas
import { CreateUserSchema } from "@/validations/userSchema";
import { NextResponse } from "next/server";
import { getAllSales } from "@/app/lib/db/lista_ventas";
import { getUserFromToken } from "@/app/lib/auth";
import argon2 from "argon2";


export async function GET() {
  try {
    const authUser = await getUserFromToken();
    if (!authUser) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
    }

    let q = await getAllSales();

    // Role 3 (cajero) solo ve sus propias ventas
    if (authUser.cargo === 3) {
      q = q.filter(venta => venta.Id_usuario === authUser.id);
    }

    return NextResponse.json(q, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener ventas" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}