"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateLoteSchema } from "@/validations/loteSchema";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function EditLote() {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(UpdateLoteSchema),
  });

  useEffect(() => {
    const fetchLote = async () => {
      try {
        const { data } = await axios.get(`/api/lote_productos/${id}`);
        setValue("Stock", data.Stock);
      } catch (err) {
        Swal.fire("Error", "No se pudo cargar el lote", "error");
      }
    };
    fetchLote();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/lote_productos/${id}`, data);
      Swal.fire({
        title: "Éxito",
        text: "Lote actualizado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/lote_productos");
    } catch (err) {
      const message = err.response?.data?.message || "Error al actualizar";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Lote</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="Stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input id="Stock" type="number" {...register("Stock")}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Stock ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Stock && <p className="text-red-500 text-xs mt-1">{errors.Stock.message}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.back()} className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
