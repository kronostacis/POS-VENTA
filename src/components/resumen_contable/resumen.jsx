"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Resumen_contable() {
  const [Ingresos, setIngresos] = useState(null);
  const [Egresos, setEgresos] = useState(null);
  const [Utilidad, setUtilidad] = useState(null);
  const [From, setFrom] = useState("2024-01-01");
  const [To, setTo] = useState(new Date().toISOString().split("T")[0]); // formato YYYY-MM-DD

  const [Caja, setCaja] = useState(null);
  const [Inventario, setInventario] = useState(null);

  useEffect(() => {
    const fromDate = new Date(From);
    const toDate = new Date(To);

    actualizarData(fromDate, toDate);
    Cuentas();
  }, []);

  const actualizarData = async (fromDate, toDate) => {
    try {
      const fromISO = fromDate.toISOString();
      const toISO = toDate.toISOString();

      const [ingresosRes, egresosRes, utilidadRes] = await Promise.all([
        axios.get(`/api/flujo_caja/ingreso?from=${fromISO}&to=${toISO}`),
        axios.get(`/api/flujo_caja/egreso?from=${fromISO}&to=${toISO}`),
        axios.get(`/api/flujo_caja/utilidad?from=${fromISO}&to=${toISO}`)
      ]);

      setIngresos(parseFloat(ingresosRes.data.ingreso));
      setEgresos(parseFloat(egresosRes.data.egreso));
      setUtilidad(parseFloat(utilidadRes.data.utilidad));
    } catch (error) {
      console.error("Error al obtener el resumen contable:", error);
    }
  };

  const Cuentas = async () => {
    try {
      const [cajaRes, inventarioRes] = await Promise.all([
        axios.get(`/api/flujo_caja/caja`),
        axios.get(`/api/flujo_caja/inventario`)
      ]);

      setCaja(parseFloat(cajaRes.data.caja));
      setInventario(parseFloat(inventarioRes.data.inventario));
    } catch (error) {
      console.error("Error al obtener los datos de la caja:", error);
    }
  };

  const handleActualizarClick = () => {
    const fromDate = new Date(From);
    const toDate = new Date(To);
    actualizarData(fromDate, toDate);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumen Contable</h2>

        <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="fromDate" className="text-gray-700">Desde:</label>
            <input
              id="fromDate"
              type="date"
              value={From}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="toDate" className="text-gray-700">Hasta:</label>
            <input
              id="toDate"
              type="date"
              value={To}
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleActualizarClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-700 text-sm">Ingresos:</p>
            <p className="text-xl font-semibold text-blue-900">{Ingresos !== null && typeof Ingresos === 'number' && !isNaN(Ingresos) ? Ingresos.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "Cargando..."}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-700 text-sm">Egresos:</p>
            <p className="text-xl font-semibold text-red-900">{Egresos !== null && typeof Egresos === 'number' && !isNaN(Egresos) ? Egresos.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "Cargando..."}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-700 text-sm">Utilidad:</p>
            <p className="text-xl font-semibold text-green-900">{Utilidad !== null && typeof Utilidad === 'number' && !isNaN(Utilidad) ? Utilidad.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "Cargando..."}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cuentas actuales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-700 text-sm">Caja:</p>
            <p className="text-xl font-semibold text-teal-900">{Caja !== null && typeof Caja === 'number' && !isNaN(Caja) ? Caja.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "Cargando..."}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-700 text-sm">Inventario:</p>
            <p className="text-xl font-semibold text-yellow-900">{Inventario !== null && typeof Inventario === 'number' && !isNaN(Inventario) ? Inventario.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "Cargando..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}