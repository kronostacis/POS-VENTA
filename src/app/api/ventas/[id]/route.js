import { NextResponse } from "next/server"; // ✅ Import necesario
import { getDetailSale } from "@/app/lib/db/lista_ventas"; // ✅ Ajusta ruta si es distinta

export async function GET(request) {
  const id = request.nextUrl.pathname.split("/").pop(); // obtén el ID desde la URL
  const idVenta = parseInt(id, 10);

  if (isNaN(idVenta)) {
    return NextResponse.json({ success: false, message: "ID inválido" }, { status: 400 });
  }

  try {
    const sale = await getDetailSale(idVenta);

    if (!sale || sale.length === 0) {
      return NextResponse.json(
        { success: false, message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(sale, { status: 200 });
  } catch (error) {
    console.error("Error al obtener detalle de la venta:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener detalle de la venta" },
      { status: 500 }
    );
  }
}