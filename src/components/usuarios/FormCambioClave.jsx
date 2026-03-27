"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangePasswordSchema } from "@/validations/userSchema";
import axios from "axios";

export default function FormCambioClave({ userId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `/api/usuarios/${userId}/cambio_clave`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess("Contraseña actualizada correctamente");
        reset();
      } else {
        setError("No se pudo actualizar la contraseña");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Ocurrió un error al actualizar la contraseña";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="Contrasena" className="block text-sm font-medium mb-1">
          Contraseña actual
        </label>
        <input
          id="Contrasena"
          type="password"
          {...register("Contrasena")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.Contrasena ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.Contrasena && (
          <p className="text-sm text-red-600">{errors.Contrasena.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="Nueva_contrasena"
          className="block text-sm font-medium mb-1"
        >
          Nueva contraseña
        </label>
        <input
          id="Nueva_contrasena"
          type="password"
          {...register("Nueva_contrasena")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.Nueva_contrasena ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.Nueva_contrasena && (
          <p className="text-sm text-red-600">
            {errors.Nueva_contrasena.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? "Actualizando..." : "Cambiar Contraseña"}
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
    </form>
  );
}
