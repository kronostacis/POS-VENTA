"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Íconos de Lucide
import {
  FileText,
  Package,
  ShoppingCart,
  Users,
  KeyRound,
  LogOut,
  Wallet,
  Menu,
  X,
} from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/usuarios/session");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  if (
    pathname === "/login" ||
    pathname === "/not-found" ||
    pathname === "/"
  )
    return null;

  const getFilteredLinks = (role, userId) => {
    const allLinks = [
      { href: "/reportes", label: "Reportes", roles: [1, 2], icon: FileText },
      { href: "/productos", label: "Productos", roles: [1, 2, 3], icon: Package },
      {
        href: "/realizar_venta",
        label: "Realizar Venta",
        roles: [1, 2, 3],
        icon: ShoppingCart,
      },
      {
        href: "/lista_ventas",
        label: "Lista de Ventas",
        roles: [1, 2, 3],        icon: FileText,
      },
      {
        href: "/lote_productos",
        label: "Lote Productos",
        roles: [1, 2],
        icon: Package,
      },
      {
        href: "/resumen_caja",
        label: "Resumen Caja",
        roles: [1, 2],
        icon: FileText,
      },
      {
        href: "/medio_pago",
        label: "Medio de Pago",
        roles: [1, 2, 3],
        icon: Wallet,
      },
      { href: "/usuarios", label: "Usuarios", roles: [1], icon: Users },
      {
        href: `/usuarios/${userId}/cambio_clave`,
        label: "Cambio de Clave",
        roles: [1, 2, 3],
        icon: KeyRound,
      },
    ];

    if (!role) return [];

    return allLinks.filter((link) => link.roles.includes(role));
  };

  const filteredLinks = getFilteredLinks(user?.cargo, user?.id);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Placeholder for possible logo/brand text */}
        <div className="text-xl font-bold md:hidden shrink-0">Menú</div>

        {/* Botón de Menú Hamburguesa */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Menú Desktop */}
        <ul className="hidden md:flex flex-wrap gap-y-2 gap-x-2 lg:gap-x-6 items-center justify-end w-full pl-4">
          {filteredLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  isActive
                    ? "bg-white/30 text-white shadow-inner"
                    : ""
                }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 rounded-md font-semibold bg-red-600 hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Menú Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2 bg-blue-700 p-4 rounded-md shadow-lg">
          {filteredLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive ? "bg-white/30 text-white shadow-inner" : "hover:bg-blue-500"
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-left w-full mt-2"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
}
