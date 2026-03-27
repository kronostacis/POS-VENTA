"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import GraficoBarra from "@/components/GraficoBarra";
import axios from "axios";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function Home() {
  const now = new Date();
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasPorPago, setVentasPorPago] = useState([]);
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  // Filtros
  const [dailyMonth, setDailyMonth] = useState(now.getMonth() + 1);
  const [dailyYear, setDailyYear] = useState(now.getFullYear());
  const [monthlyYear, setMonthlyYear] = useState(now.getFullYear());

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get("/api/usuarios/session");
        if (res.status === 200) {
          setUserRole(res.data.cargo);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/login");
      }
    };
    fetchUserRole();
  }, [router]);

  const fetchDiarias = useCallback(() => {
    fetch(`/api/reportes/reportes_ventasDiarias?month=${dailyMonth}&year=${dailyYear}`)
      .then(res => res.json())
      .then(setVentasDiarias);
  }, [dailyMonth, dailyYear]);

  const fetchMensuales = useCallback(() => {
    fetch(`/api/reportes/reportes_ventasMensuales?year=${monthlyYear}`)
      .then(res => res.json())
      .then(setVentasMensuales);
  }, [monthlyYear]);

  const fetchPagos = useCallback(() => {
    fetch("/api/reportes/reportes_ventasPagos")
      .then(res => res.json())
      .then(setVentasPorPago);
  }, []);

  // Cargar datos iniciales cuando se confirma el rol
  useEffect(() => {
    if (userRole !== null && (userRole === 1 || userRole === 2)) {
      fetchDiarias();
      fetchMensuales();
      fetchPagos();
    } else if (userRole !== null) {
      router.push("/not-found");
    }
  }, [userRole, router, fetchDiarias, fetchMensuales, fetchPagos]);

  // Rango de años disponibles
  const currentYear = now.getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    yearOptions.push(y);
  }

  if (userRole === null) {
    return <div>Cargando...</div>;
  }

  if (userRole !== 1 && userRole !== 2) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes de Ventas</h1>
        <p className="text-sm text-gray-500 mt-1">Revisa el rendimiento diario, mensual y los medios de pago utilizados.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Diarias */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-800">Ventas Diarias</h2>
            <div className="flex gap-2">
              <select
                value={dailyMonth}
                onChange={(e) => setDailyMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {MESES.map((nombre, i) => (
                  <option key={i} value={i + 1}>{nombre}</option>
                ))}
              </select>
              <select
                value={dailyYear}
                onChange={(e) => setDailyYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6 flex-1 min-h-[350px]">
            <GraficoBarra
              data={ventasDiarias}
              xKey="fecha"
              yKey="total"
            />
          </div>
        </div>

        {/* Ventas Mensuales */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-800">Ventas Mensuales</h2>
            <div className="flex gap-2">
              <select
                value={monthlyYear}
                onChange={(e) => setMonthlyYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6 flex-1 min-h-[350px]">
            <GraficoBarra
              data={ventasMensuales}
              xKey="Mes"
              yKey="Total"
            />
          </div>
        </div>

        {/* Ventas por Medio de Pago */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Ventas por Medio de Pago</h2>
          </div>
          <div className="p-6 min-h-[350px]">
            <GraficoBarra
              data={ventasPorPago}
              xKey="metodo"
              yKey="total"
              horizontal
            />
          </div>
        </div>
      </div>
    </div>
  );
}
