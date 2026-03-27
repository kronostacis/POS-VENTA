"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'


export default function RealizarVenta( id_user ) {
  const [productos, setProductos] = useState([]);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [medios_de_pago, setMediosDePago] = useState([]);
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios
      .get("/api/medio_pago")
      .then((res) => {
        if (res.status === 200) {
          setMediosDePago(res.data);
        } else {
          console.error("Error al obtener los medios de pago");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  }, []);

  const agregarProductoPorId = async (id) => {
    try {
      const resProducto = await axios.get(`/api/productos/${id}`,
        {headers: { "Content-Type": "application/json" },
          withCredentials: true,});
      if (resProducto.status !== 200) {
        Swal.fire({
        icon: "error",
        title: "Producto no encontrado.",
        text: "Por favor revisar que el código se haya ingresado correctamente.",
      });
        return;
      }

      const producto = resProducto.data;
      console.log("producto:",producto)

      const resLotes = await axios.get(`/api/get_lote/${id}`);
      if (resLotes.status !== 200) {
        Swal.fire({
        icon: "error",
        title: "Error al encontrar el lote.",
        text: "Por favor contactar a administración.",
      });
        return;
      }

      const lotes = resLotes.data;

      const productoConDatos = {
        ...producto,
        cantidad: 1,
        lotes,
      };

      setProductos((prev) => {
      // Buscar si el producto ya está
      const productoExistente = prev.find((p) => p.Id_producto === producto.Id_producto);
      if (productoExistente) {
        // Si existe, actualizar cantidad (sumar 1)
        return prev.map((p) =>
          p.Id_producto === producto.Id_producto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      } else {
        // Si no existe, agregar nuevo con cantidad 1 y lotes
        return [...prev, { ...producto, cantidad: 1, lotes }];
      }
    });

    setCodigoProducto(""); // limpiar input
    } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Producto no encontrado.",
        text: "Por favor revisar que el código se haya ingresado correctamente.",
      });
    } else {
      console.error("Error al agregar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al intentar agregar el producto.",
      });
    }
  }
  };

  const eliminarProductoPorId = (id) => {
    setProductos((prev) => prev.filter((producto) => producto.Id_producto !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.Id_producto === id ? { ...producto, cantidad: nuevaCantidad } : producto
      )
    );
  };

  const calcularTotal = () => {
    const t = productos.reduce(
      (acc, p) => acc + p.Precio_venta * p.cantidad,
      0
    );
    setTotal(t);
  };

  useEffect(() => {
    calcularTotal();
  }, [productos]);

  const realizarVenta = async () => {
    try {
      
      let utilidad = 0;

      if (productos.length === 0) {
        Swal.fire({
          title: "Debe agregar al menos un producto.",
          icon: "warning",
        });
        return;
      }

      if(medioPagoSeleccionado == null){
        Swal.fire({
          title: "No ha seleccionado el medio de pago.",
          icon: "question",
        });
        return;
      }

      for (const producto of productos) {
        const cantidadNecesaria = producto.cantidad;
        const lotes = [...producto.lotes];
        let cantidadRestante = cantidadNecesaria;

        const stockTotal = lotes.reduce((acc, lote) => acc + lote.Stock, 0);
        if (stockTotal < cantidadNecesaria) {
          //alert(`Stock insuficiente para el producto "${producto.nombre}"`);
          Swal.fire({
            title: `Stock insuficiente para el producto "${producto.Nombre}"`,
            icon: "error",
        });
          return;
        }

        for (const lote of lotes) {
          if (cantidadRestante === 0) break;

          if (lote.Stock >= cantidadRestante) {
            const nuevoStock = lote.Stock - cantidadRestante;
            utilidad +=
              (producto.Precio_venta - lote.Precio_compra) * cantidadRestante;

              /*
            await axios.put(`/api/lote_productos/${lote.Id_lote}`, {
              Stock: nuevoStock,
            });
            */
            try {
                await axios.put(`/api/lote_productos/${lote.Id_lote}`, {
                  Stock: nuevoStock,
                  Cantidad: lote.Cantidad,
                });
              } catch (error) {
                console.error("Error al actualizar lote:", error.response?.data || error.message);
              }
            cantidadRestante = 0;
          } else {
            await axios.put(`/api/lote_productos/${lote.Id_lote}`, {
              Stock: 0,
              Cantidad: lote.Cantidad,
            });

            utilidad +=
              (producto.Precio_venta - lote.Precio_compra) * lote.Stock;
            cantidadRestante -= lote.Stock;
          }
        }
      }

      const res = await axios.post("/api/realizar_venta", {
        Id_pago: medioPagoSeleccionado,
        Total_venta: total,
        Id_usuario: id_user.id,
        Utilidad_total: utilidad,
        Id_estado_venta: 1,
      });

      const idVenta = res.data.Id_venta;

      for (const producto of productos) {
        console.log("Producto: ",producto);
        await axios.post("/api/detalle_venta", {
          Id_venta: idVenta,
          Id_producto: producto.Id_producto,
          Cantidad: producto.cantidad,
          Precio_total: producto.Precio_venta * producto.cantidad,
        });
      }

      Swal.fire({
        title: "Venta realizada correctamente.",
        icon: "success"
      });
      setProductos([]);
      setMedioPagoSeleccionado(null);
      setTotal(0);
    } catch (error) {
      console.error("Error al realizar la venta: ", error);
      Swal.fire({
        icon: "error",
        title: "Error al realizar la venta.",
        text: "SPor favor, ponerse en contacto con la administración",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">🛒 Realizar Venta</h2>

      {/* Input producto */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Código del producto"
          value={codigoProducto}
          onChange={(e) => setCodigoProducto(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="button"
          onClick={() => agregarProductoPorId(codigoProducto)}
        >
          Agregar
        </button>
      </div>

      {/* Lista de productos */}
      <h4 className="text-lg font-semibold mb-2">🧾 Productos en la venta</h4>
      <ul className="space-y-2 mb-4">
        {productos.map((prod) => (
          <li
            key={prod.Id_producto}
            className="bg-white border rounded p-3 flex items-center justify-between"
          >
            <div className="flex-1">
              <strong>{prod.Nombre}</strong> - ${prod.Precio_venta.toLocaleString("es-CL")} x{" "}
              <input
                type="number"
                className="inline-block w-20 border border-gray-300 rounded px-2 py-1 ml-2"
                value={prod.cantidad}
                min={1}
                onChange={(e) =>
                  cambiarCantidad(prod.Id_producto, parseInt(e.target.value))
                }
              />{" "}
              = ${(prod.Precio_venta * prod.cantidad).toLocaleString("es-CL")}
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => eliminarProductoPorId(prod.Id_producto)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Total */}
      <h4 className="text-lg font-bold mb-4">💰 Total: ${total.toLocaleString("es-CL")}</h4>

      {/* Medio de pago */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Medio de pago:</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={medioPagoSeleccionado || ""}
          onChange={(e) => setMedioPagoSeleccionado(parseInt(e.target.value))}
        >
          <option value="">Seleccione un medio</option>
          {medios_de_pago.map((m) => (
            <option key={m.Id_pago} value={m.Id_pago}>
              {m.Nombre_pago}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de venta */}
      <div className="text-center">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={realizarVenta}
        >
          ✅ Realizar venta
        </button>
      </div>
    </div>
  );
}
