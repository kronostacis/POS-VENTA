import { NextResponse } from "next/server";
import { obtenerVentasDiarias } from "@/app/lib/db/reportes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const month = parseInt(searchParams.get("month")) || now.getMonth() + 1;
  const year = parseInt(searchParams.get("year")) || now.getFullYear();

  const data = await obtenerVentasDiarias(month, year);
  return NextResponse.json(data);
}