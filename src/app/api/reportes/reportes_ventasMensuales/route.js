import { NextResponse } from "next/server";
import { obtenerVentasMensuales } from "@/app/lib/db/reportes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  const data = await obtenerVentasMensuales(year);
  return NextResponse.json(data);
}