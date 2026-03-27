import { NextResponse } from "next/server";

export async function POST() {
  const res = new NextResponse(JSON.stringify({ ok: true }));

  res.cookies.set("accessToken", "", {
    path: "/",
    expires: new Date(0), // Fecha expirada
  });

  res.cookies.set("refreshToken", "", {
    path: "/",
    expires: new Date(0), // Fecha expirada
  });
  return res;
}
