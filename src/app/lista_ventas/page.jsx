"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

// Modal para mostrar el detalle de la venta
function DetalleVentaModal({ venta, detalle, onClose, userRole }) {
  if (!venta || !detalle) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalle de Venta #{venta.Id_venta}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(venta.Fecha_venta).toLocaleString("es-CL", {
              timeZone: "America/Santiago",
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          <p>
            <strong>Total:</strong>{" "}
            <span className="font-semibold text-lg text-green-600">
              ${venta.Total_venta.toLocaleString("es-CL")}
            </span>
          </p>

          <p>
            <strong>Atendido por:</strong> {venta.Usuarios.Nombre}
          </p>
          <p>
            <strong>Medio de Pago:</strong> {venta.Medio_pagos.Nombre_pago}
          </p>
          {(userRole === 1 || userRole === 2) && venta.Utilidad_total !== undefined && (
            <p>
              <strong>Utilidad:</strong>{" "}
              <span className="font-semibold text-lg text-blue-600">
                ${venta.Utilidad_total.toLocaleString("es-CL")}
              </span>
            </p>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Productos:</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Array.isArray(detalle) && detalle.length > 0 ? (
              detalle.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                >
                  <div>
                    <p className="font-semibold">
                      {item.Productos?.Nombre || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.Cantidad}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${item.Precio_total.toLocaleString("es-CL")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay detalles para mostrar.</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState("");
  const itemsPerPage = 10;


  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("/api/usuarios/session");
        if (res.status === 200) {
          setUserRole(res.data.cargo);
          setUserId(res.data.id);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/login");
      }
    };
    fetchSession();
  }, [router]);

  useEffect(() => {
    if (userRole !== null) {
      if (userRole !== 1 && userRole !== 2 && userRole !== 3) {
        router.push("/not-found");
      } else {
        axios
          .get("/api/ventas")
          .then((res) => {
            let data = res.data;
            // Role 3 (cajero) solo ve sus propias ventas
            if (userRole === 3 && userId) {
              data = data.filter((v) => v.Id_usuario === userId);
            }
            setVentas(data);
          })
          .catch((error) => console.error("Error en la solicitud:", error));
      }
    }
  }, [userRole, userId, router]);

  // Usuarios únicos para el filtro
  const uniqueUsers = [...new Map(
    ventas.map((v) => [v.Usuarios.Nombre, v.Usuarios.Nombre])
  ).values()];

  // Filtrar por usuario
  const filteredVentas = selectedUser
    ? ventas.filter((v) => v.Usuarios.Nombre === selectedUser)
    : ventas;

  // Paginación
  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVentas = filteredVentas.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const verDetalle = async (venta) => {
    setSelectedVenta(venta);
    try {
      const res = await axios.get(`/api/ventas/${venta.Id_venta}`);
      setDetalle(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalle:", err);
      setDetalle(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenta(null);
    setDetalle(null);
  };

  const handleDownloadReceipt = async (saleId) => {
    try {
      const response = await axios.get(`/api/generate_receipt/${saleId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `comprobante_venta_${saleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Error al descargar el comprobante.");
    }
  };

  const handleExportExcel = async () => {
    try {
      const url = new URL("/api/ventas/exportar", window.location.origin);
      if (selectedUser) {
        url.searchParams.append("usuario", selectedUser);
      }
      
      const response = await axios.get(url.toString(), {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      const contentDisposition = response.headers["content-disposition"];
      let filename = "ventas.csv";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match.length === 2) filename = match[1];
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading excel:", error);
      alert("Error al descargar el Excel.");
    }
  };

  if (userRole === null) {
    return <div>Cargando...</div>;
  }

  if (userRole !== 1 && userRole !== 2 && userRole !== 3) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">


      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Listado de Ventas</h1>
        <div className="flex items-center gap-3">
          {(userRole === 1 || userRole === 2) && (
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los usuarios</option>
              {uniqueUsers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
          {(userRole === 1 || userRole === 2) && (
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white flex items-center gap-2 py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Excel
            </button>
          )}
          <button
            onClick={() => {
              setViewMode(viewMode === "card" ? "table" : "card");
              setCurrentPage(1);
            }}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            {viewMode === "card" ? "Ver Tabla" : "Ver Tarjetas"}
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVentas.map((venta) => (
            <div
              key={venta.Id_venta}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">
                    Venta #{venta.Id_venta}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      venta.Id_estado_venta === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {venta.Id_estado_venta === 1 ? "Completada" : "Pendiente"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(venta.Fecha_venta).toLocaleString("es-CL", {
                    timeZone: "America/Santiago",
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="flex justify-between">
                    <strong>Total:</strong>{" "}
                    <span className="font-semibold">
                      ${venta.Total_venta.toLocaleString("es-CL")}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <strong>Atendido por:</strong>{" "}
                    <span className="font-semibold">
                      {venta.Usuarios.Nombre}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <strong>Medio de Pago:</strong>{" "}
                    <span className="font-semibold">
                      {venta.Medio_pagos.Nombre_pago}
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => verDetalle(venta)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                  >
                    Ver Detalle
                  </button>
                  {(userRole === 1 || userRole === 2) && (
                    <button
                      onClick={() => handleDownloadReceipt(venta.Id_venta)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none"
                    >
                      Descargar Comprobante
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atendido por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medio de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVentas.length > 0 ? (
                paginatedVentas.map((venta) => (
                  <tr key={venta.Id_venta} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venta.Id_venta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(venta.Fecha_venta).toLocaleString("es-CL", {
                        timeZone: "America/Santiago",
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${venta.Total_venta.toLocaleString("es-CL")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venta.Usuarios.Nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venta.Medio_pagos.Nombre_pago}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          venta.Id_estado_venta === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {venta.Id_estado_venta === 1 ? "Completada" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => verDetalle(venta)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Ver Detalle
                      </button>
                      {(userRole === 1 || userRole === 2) && (
                        <button
                          onClick={() => handleDownloadReceipt(venta.Id_venta)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Descargar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No hay ventas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredVentas.length)} de{" "}
            {filteredVentas.length} venta{filteredVentas.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === page
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <DetalleVentaModal
          venta={selectedVenta}
          detalle={detalle}
          onClose={closeModal}
          userRole={userRole}
        />
      )}
    </div>
  );
}
