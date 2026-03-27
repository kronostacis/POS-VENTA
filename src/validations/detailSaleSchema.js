import * as yup from "yup";

// Esquema de validación con Yup
const detailSaleSchema = yup.object({
  Id_venta: yup.number().required("El id de venta es obligatorio"),
  Id_producto: yup.number().required("El id de producto es obligatorio"),
  Cantidad: yup.number().required("La cantidad es obligatoria"),
  Precio_total: yup.number().required("El precio total es obligatorio"),
});

export { detailSaleSchema }