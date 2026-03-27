import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rutas públicas de API que no requieren token
  if (
    pathname === '/api/login' || 
    pathname.startsWith('/api/login/') || 
    pathname === '/api/logout' || 
    pathname.startsWith('/api/logout/')
  ) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith('/api/');

  function unauthorizedResponse() {
    if (isApiRoute) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return unauthorizedResponse();
  }

  let accessTokenValido = false;

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(accessToken, secret);
      accessTokenValido = true;
      return NextResponse.next();
    } catch (error) {
      console.error("Access Token inválido:", error);
      // Si el access token es inválido y no hay refresh token, no autorizamos
      if (!refreshToken) {
        return unauthorizedResponse();
      }
    }
  }

  if (refreshToken && !accessTokenValido) {
    try {
      const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
      const refresh_decode = await jwtVerify(refreshToken, refreshSecret);

      const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET);
      // Generar nuevo accessToken con 'jose' 
      const newAccessToken = await new SignJWT({
        id: refresh_decode.payload.id,
        name: refresh_decode.payload.name,
        lastName: refresh_decode.payload.lastName,
        role: refresh_decode.payload.role,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(accessSecret);

      // Crear respuesta con la nueva cookie
      const response = NextResponse.next();
      response.cookies.set({
        name: "accessToken",
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hora
        path: "/",
      });

      return response;
    } catch (error) {
      console.error("Refresh Token inválido:", error);
      return unauthorizedResponse();
    }
  }

  return unauthorizedResponse();
}

// Aplicar middleware a front-end y proteger todas las rutas de la API
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ventas/:path*",
    "/usuarios/:path*",
    "/productos/:path*",
    "/reportes/:path*",
    "/realizar_venta/:path*",
    "/lista_ventas/:path*",
    "/lote_productos/:path*",
    "/resumen_caja/:path*",
    "/medio_pago/:path*",
    "/api/:path*", // Protege toda la API, luego en el código dejamos pasar /api/login
  ],
};
