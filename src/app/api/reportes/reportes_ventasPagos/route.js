import { NextResponse } from "next/server";
import { obtenerVentasPorPago } from "@/app/lib/db/reportes";

export async function GET() {
  const data = await obtenerVentasPorPago();
  return NextResponse.json(data);
}