// ver y crear todos los medios de pago
import { CreateMedio_pagosSchema } from "@/validations/Medio_pagosSchema";
import { NextResponse } from "next/server";
import { getAllMedio_pago, createMedio_pago } from "@/app/lib/db/medio_pago";

export async function GET() {
  try {
    const q = await getAllMedio_pago();

    return NextResponse.json(q, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al obtener medios de pagos:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener medios de pagos" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
export async function POST(request) {
  try {
    var data = await request.json();
    await CreateMedio_pagosSchema.validate(data, {
      abortEarly: false,
    });

    const Medio_pago = await createMedio_pago(data);
    return NextResponse.json(Medio_pago, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al crear medio de pago:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear medio de pago" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}