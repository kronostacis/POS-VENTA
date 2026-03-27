// toda la logica de la venta
import { detailSaleSchema } from "@/validations/detailSaleSchema";
import { NextResponse } from "next/server";
//importar funciones
import { newDetailSale } from "@/app/lib/db/realizar_venta";

export async function POST(request) {
  try {
    var data = await request.json();
    //console.log("Data:",data);
    await detailSaleSchema.validate(data, {
      abortEarly: false,
    });

    const sale = await newDetailSale(data);

    return NextResponse.json(sale, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear la venta" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}