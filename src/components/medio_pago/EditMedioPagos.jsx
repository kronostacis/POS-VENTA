"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateMedio_pagosSchema } from "@/validations/Medio_pagosSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function EditMedioPagos({ id }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdateMedio_pagosSchema),
  });

  useEffect(() => {
    const fetchMedioPago = async () => {
      try {
        const res = await axios.get(`/api/medio_pago/${parseInt(id)}`);
        if (res.status === 200) {
          setValue("Nombre_pago", res.data.Nombre_pago);
        } else {
          Swal.fire("Error", "No se pudo cargar el medio de pago.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error al cargar el medio de pago.", "error");
      }
    };
    fetchMedioPago();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await axios.put(`/api/medio_pago/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        icon: "success",
        title: "Medio de pago actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/medio_pago");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error al actualizar el medio de pago";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Medio de Pago</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
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
            <button type="button" onClick={() => router.back()} className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Medio de Pago"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
