// app/layout.js
import "./globals.css";
import NavBar from "@/components/NavBar";
import { getUserFromToken } from "./lib/auth";
import { headers } from "next/headers";

export default async function RootLayout({ children }) {
  const user = await getUserFromToken();

  return (
    <html lang="es">
      <body>
        {<NavBar />}
        {children}
      </body>
    </html>
  );
}
