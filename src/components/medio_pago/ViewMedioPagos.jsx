"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateMedio_pagosSchema } from "@/validations/Medio_pagosSchema";
import axios from "axios";
import Swal from "sweetalert2";

// Modal para crear medio de pago
function CreateMedioPagoModal({ isOpen, onClose, onMedioPagoCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(CreateMedio_pagosSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/medio_pago", data);
      Swal.fire("Éxito", "Medio de pago creado correctamente", "success");
      onMedioPagoCreated();
      onClose();
      reset();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al crear el medio de pago";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Medio de Pago</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="Nombre_pago"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Medio de Pago
            </label>
            <input
              id="Nombre_pago"
              type="text"
              {...register("Nombre_pago")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Nombre_pago ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Nombre_pago && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Nombre_pago.message}
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
              {isSubmitting ? "Agregando..." : "Agregar Medio de Pago"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal
export default function ViewMedioPagos({ userRole }) {
  const [medioPagos, setMedioPagos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMedioPagos = async () => {
    try {
      const res = await axios.get("/api/medio_pago");
      setMedioPagos(res.data);
    } catch (error) {
      console.error("Error al obtener medios de pago:", error);
      Swal.fire("Error", "No se pudieron cargar los medios de pago", "error");
    }
  };

  useEffect(() => {
    fetchMedioPagos();
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
          await axios.delete(`/api/medio_pago/${id}`);
          Swal.fire(
            "Eliminado",
            "El medio de pago ha sido eliminado.",
            "success"
          );
          fetchMedioPagos();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el medio de pago.", "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Medios de Pago
        </h1>
        {userRole !== 3 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Agregar Medio de Pago
          </button>
        )}
      </div>

      <CreateMedioPagoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMedioPagoCreated={fetchMedioPagos}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              {userRole !== 3 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medioPagos.map((pago) => (
              <tr key={pago.Id_pago} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pago.Id_pago}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pago.Nombre_pago}
                </td>
                {userRole !== 3 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <a
                      href={`/medio_pago/${pago.Id_pago}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => handleDelete(pago.Id_pago)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
