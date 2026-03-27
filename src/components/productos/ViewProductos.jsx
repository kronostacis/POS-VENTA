"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProductSchema } from "@/validations/productSchema";
import axios from "axios";
import Swal from "sweetalert2";
import { Search } from "lucide-react";
import { useRef } from "react";

// Modal para crear producto
function CreateProductModal({ isOpen, onClose, onProductCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(CreateProductSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/productos", data);
      Swal.fire("Éxito", "Producto creado correctamente", "success");
      onProductCreated();
      onClose();
      reset();
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el producto";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-white/30 backdrop-blur-sm  flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Producto</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              htmlFor="Precio_venta"
              className="block text-sm font-medium text-gray-700"
            >
              Precio de Venta
            </label>
            <input
              id="Precio_venta"
              type="number"
              {...register("Precio_venta")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.Precio_venta ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Precio_venta && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Precio_venta.message}
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
              {isSubmitting ? "Agregando..." : "Agregar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal
export default function ViewProductos({ userRole }) {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar explícitamente la extensión del archivo
    if (!file.name.toLowerCase().endsWith('.csv')) {
      Swal.fire("Error", "Por favor, sube un archivo con extensión .csv", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        
        // Parsear CSV nativamente
        // Dividir por saltos de línea (manejando \r\n o \n)
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        
        if (lines.length === 0) {
          Swal.fire("Error", "El archivo CSV está vacío", "error");
          return;
        }

        // Obtener cabeceras (primera línea) separadas por coma
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
        
        // Validar columnas básicas
        if (
          !headers.includes("Nombre") ||
          !headers.includes("Precio_venta") ||
          !headers.includes("Precio_compra") ||
          !headers.includes("Cantidad")
        ) {
          Swal.fire(
            "Error",
            "El archivo CSV debe contener exactamente las columnas: Nombre, Precio_venta, Precio_compra y Cantidad.",
            "error"
          );
          return;
        }

        // Parsear líneas restantes en un arreglo de objetos JSON
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(",");
          // Asegurar que la línea iterada no esté vacía y coincida el n° cabeceras (básico)
          if(currentLine.length === headers.length) {
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = currentLine[index].trim().replace(/^"|"$/g, "");
            });
            data.push(rowData);
          }
        }

        if (data.length === 0) {
          Swal.fire("Error", "El archivo CSV no contiene filas de productos válidas", "error");
          return;
        }

        // Mostrar loading spinner/espera
        Swal.fire({
          title: "Cargando productos...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Enviar datos al endpoint masivo
        const res = await axios.post("/api/productos/cargar_excel", data);
        Swal.fire(
          "Éxito",
          `Se importaron ${res.data.insertados || "los"} productos y sus lotes correctamente.`,
          "success"
        );

        fetchProductos(); // Refrescar tabla
      } catch (error) {
        console.error("Error al procesar el CSV:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Ocurrió un error al procesar el archivo CSV",
          "error"
        );
      } finally {
        // Resetear input file para permitir cargar el mismo archivo nuevamente
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file, "utf-8");
  };

  // Filtrar productos por búsqueda
  const filteredProductos = productos.filter((producto) =>
    producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProductos = filteredProductos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Resetear página al buscar
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
          await axios.delete(`/api/productos/${id}`);
          Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
          fetchProductos();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  // Generar rango de páginas visibles
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Productos
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/api/productos/exportar";
              link.click();
            }}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none text-sm font-medium"
          >
            📥 Descargar CSV
          </button>
          
          {userRole !== 3 && (
            <>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none text-sm font-medium"
              >
                ⬆️ Cargar CSV
              </button>
            </>
          )}
          {userRole !== 3 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Agregar Producto
            </button>
        )}
        </div>
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={fetchProductos}
      />

      {/* Buscador */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              {userRole !== 3 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProductos.length > 0 ? (
              paginatedProductos.map((producto) => (
                <tr key={producto.Id_producto} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {producto.Id_producto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {producto.Nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${producto.Precio_venta.toLocaleString("es-CL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.Stock || 0}
                  </td>
                  {userRole !== 3 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <a
                        href={`/productos/${producto.Id_producto}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => handleDelete(producto.Id_producto)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={userRole !== 3 ? 5 : 4}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "No se encontraron productos que coincidan con la búsqueda."
                    : "No hay productos registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredProductos.length)} de{" "}
            {filteredProductos.length} producto
            {filteredProductos.length !== 1 ? "s" : ""}
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
    </div>
  );
}
