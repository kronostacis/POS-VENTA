"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateUserSchema } from "@/validations/userSchema";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Home() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Error, setError] = useState("");

  // verificar si el usuario puede ver esta pagina

  // consultar datos del usuario

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(UpdateUserSchema),
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      const userId = parseInt(id);
      try {
        const res = await axios.get(`/api/usuarios/${userId}`);
        if (res.status === 200) {
          setUsuario(res.data);
          reset({
            Cargo: res.data.Cargo?.toString() || "",
            Nombre: res.data.Nombre || "",
            Apellido_1: res.data.Apellido_1 || "",
            Apellido_2: res.data.Apellido_2 || "",
          });
        } else {
          console.error("Error al obtener los usuarios");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchUsuario();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      const userId = parseInt(id); // 🔴 Esto faltaba

      const response = await axios.put(`/api/usuarios/${userId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        window.location.href = "/usuarios";
      } else {
        console.error("Error al actualizar el usuario");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error al actualizar el usuario";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="Nombre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            id="Nombre"
            type="text"
            {...register("Nombre")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Nombre ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.Nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.Nombre.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="Primer_Apellido"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Primer Apellido
          </label>
          <input
            id="Primer_Apellido"
            type="text"
            {...register("Apellido_1")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Apellido_1 ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Primer apellido del usuario"
          />
          {errors.Apellido_1 && (
            <p className="mt-1 text-sm text-red-600">
              {errors.Apellido_1.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="Segundo_Apellido"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Segundo Apellido
          </label>
          <input
            id="Segundo_Apellido"
            type="text"
            {...register("Apellido_2")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Apellido_2 ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Segundo apellido del usuario"
          />
          {errors.Apellido_2 && (
            <p className="mt-1 text-sm text-red-600">
              {errors.Apellido_2.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="Cargo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selecciona un cargo:
          </label>
          <select
            id="Cargo"
            {...register("Cargo")}
            className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Cargo ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Selecciona --</option>
            <option value="1">Administrador</option>
            <option value="2">Dueño</option>
            <option value="3">Cajero</option>
          </select>
          {errors.Cargo && (
            <p className="mt-1 text-sm text-red-600">{errors.Cargo.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting ? "Actualizando usuario..." : "Actualizar Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
