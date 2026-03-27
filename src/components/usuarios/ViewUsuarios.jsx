"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateUserSchema } from "@/validations/userSchema";
import axios from "axios";
import Swal from "sweetalert2";

// Componente para el botón de cambio de estado
function UserAccessToggle({ usuario, onToggle }) {
  const [isActive, setIsActive] = useState(usuario.Id_estado_usuario === 1);

  useEffect(() => {
    setIsActive(usuario.Id_estado_usuario === 1);
  }, [usuario.Id_estado_usuario]);

  const handleToggle = () => {
    const newStatus = !isActive;
    const nuevoIdEstado = newStatus ? 1 : 0;
    onToggle?.(usuario.Id_usuario, nuevoIdEstado);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-24 text-white py-1 px-2 rounded-md text-sm focus:outline-none ${
        isActive
          ? "bg-green-500 hover:bg-green-600"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {isActive ? "Activado" : "Desactivado"}
    </button>
  );
}

// Componente para el modal de creación de usuario
function CreateUserModal({ isOpen, onClose, onUserCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(CreateUserSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/usuarios", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      Swal.fire("Éxito", "Usuario creado correctamente", "success");
      onUserCreated(); // Llama a la función para recargar usuarios
      onClose(); // Cierra el modal
      reset(); // Limpia el formulario
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear el usuario";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del formulario */}
          <div>
            <label
              htmlFor="Id_usuario"
              className="block text-sm font-medium text-gray-700"
            >
              ID Usuario (RUT)
            </label>
            <input
              id="Id_usuario"
              type="number"
              {...register("Id_usuario")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Id_usuario ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Id_usuario && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Id_usuario.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="Nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              id="Nombre"
              type="text"
              {...register("Nombre")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="Primer_Apellido"
              className="block text-sm font-medium text-gray-700"
            >
              Primer Apellido
            </label>
            <input
              id="Primer_Apellido"
              type="text"
              {...register("Apellido_1")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Apellido_1 ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Apellido_1 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Apellido_1.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="Segundo_Apellido"
              className="block text-sm font-medium text-gray-700"
            >
              Segundo Apellido
            </label>
            <input
              id="Segundo_Apellido"
              type="text"
              {...register("Apellido_2")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Apellido_2 ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Apellido_2 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Apellido_2.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="Cargo"
              className="block text-sm font-medium text-gray-700"
            >
              Cargo
            </label>
            <select
              id="Cargo"
              {...register("Cargo")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Cargo ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Seleccionar Cargo --</option>
              <option value="1">Administrador</option>
              <option value="2">Dueño</option>
              <option value="3">Cajero</option>
            </select>
            {errors.Cargo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Cargo.message}
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
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal que muestra la tabla de usuarios
export default function ViewUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("/api/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await axios.put(`/api/usuarios/${id}/estado`, {
        Id_estado_usuario: nuevoEstado,
      });
      Swal.fire("Éxito", "Estado del usuario actualizado", "success");
      fetchUsuarios(); // Recargar para mostrar el cambio
    } catch (error) {
      console.error("Error al cambiar estado del usuario", error);
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  const obtenerRol = (id) => {
    const roles = { 1: "Administrador", 2: "Dueño", 3: "Cajero" };
    return roles[id] || "Desconocido";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          Crear Usuario
        </button>
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={fetchUsuarios}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
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
            {usuarios.map((usuario) => (
              <tr key={usuario.Id_usuario} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.Id_usuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${usuario.Nombre} ${usuario.Apellido_1} ${usuario.Apellido_2}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {obtenerRol(usuario.Cargo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <UserAccessToggle
                    usuario={usuario}
                    onToggle={handleEstadoChange}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={`/usuarios/${usuario.Id_usuario}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
