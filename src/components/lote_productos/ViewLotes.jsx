"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateLoteSchema } from "@/validations/loteSchema";
import axios from "axios";
import Swal from "sweetalert2";

// Modal para crear lote
function CreateLoteModal({ isOpen, onClose, onLoteCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(CreateLoteSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue("Fecha", new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/lote_productos", data);
      Swal.fire("Éxito", "Lote creado correctamente", "success");
      onLoteCreated();
      onClose();
      reset();
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el lote";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-white/30  backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Lote</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="Id_producto"
              className="block text-sm font-medium text-gray-700"
            >
              ID Producto
            </label>
            <input
              id="Id_producto"
              type="number"
              {...register("Id_producto")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Id_producto ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Id_producto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Id_producto.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="Precio_compra"
              className="block text-sm font-medium text-gray-700"
            >
              Precio de Compra
            </label>
            <input
              id="Precio_compra"
              type="number"
              step="0.01"
              {...register("Precio_compra")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Precio_compra ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Precio_compra && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Precio_compra.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="Cantidad"
              className="block text-sm font-medium text-gray-700"
            >
              Cantidad
            </label>
            <input
              id="Cantidad"
              type="number"
              {...register("Cantidad")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Cantidad ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Cantidad && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Cantidad.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="Fecha"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha
            </label>
            <input
              id="Fecha"
              type="date"
              {...register("Fecha")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Fecha ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Fecha && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Fecha.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isSubmitting ? "Agregando..." : "Agregar Lote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal
export default function ViewLotes() {
  const [lotes, setLotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLotes = async () => {
    try {
      const res = await axios.get("/api/lote_productos");
      setLotes(res.data);
    } catch (error) {
      console.error("Error al obtener lotes:", error);
      Swal.fire("Error", "No se pudieron cargar los lotes", "error");
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/lote_productos/${id}`);
          Swal.fire("Eliminado", "El lote ha sido eliminado.", "success");
          fetchLotes();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el lote.", "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="brown" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3m-6 9v-6a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25v6M13.5 7.5h3.375c.621 0 1.125.504 1.125 1.125v.375m-4.5-1.5h-1.5m-6.75 0H10.5" />
        </svg>
        Gestión de Lotes
      </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          Agregar Lote
        </button>
      </div>

      <CreateLoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoteCreated={fetchLotes}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Lote
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Compra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lotes.map((lote) => (
              <tr key={lote.Id_lote} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lote.Id_lote}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lote.Id_producto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${lote.Precio_compra.toLocaleString("es-CL")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lote.Cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lote.Stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lote.Fecha).toLocaleDateString("es-CL", { timeZone: "America/Santiago" })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <a
                    href={`/lote_productos/${lote.Id_lote}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </a>
                  <button
                    onClick={() => handleDelete(lote.Id_lote)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
