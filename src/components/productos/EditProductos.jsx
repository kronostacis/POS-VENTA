"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateProductSchema } from "@/validations/productSchema";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function EditProducto() {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(UpdateProductSchema),
  });

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const { data } = await axios.get(`/api/productos/${id}`);
        setValue("Nombre", data.Nombre);
        setValue("Precio_venta", data.Precio_venta);
      } catch (err) {
        Swal.fire("Error", "No se pudo cargar el producto", "error");
      }
    };
    fetchProducto();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/productos/${id}`, data);
      Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/productos");
    } catch (err) {
      const message = err.response?.data?.message || "Error al actualizar";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Producto</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input id="Nombre" type="text" {...register("Nombre")}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Nombre && <p className="text-red-500 text-xs mt-1">{errors.Nombre.message}</p>}
          </div>

          <div>
            <label htmlFor="Precio_venta" className="block text-sm font-medium text-gray-700">Precio de Venta</label>
            <input id="Precio_venta" type="number" {...register("Precio_venta")}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Precio_venta ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Precio_venta && <p className="text-red-500 text-xs mt-1">{errors.Precio_venta.message}</p>}
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
