import * as yup from "yup";

// Esquema de validación con Yup
const SellSchema = yup.object({
  Id_pago: yup.number().required("El id de pago es obligatorio"),
  Total_venta: yup.number().required("El total de la vents es obligatorio"),
  Id_usuario: yup.number().required("El id de usuario es obligatorio"),
  Utilidad_total: yup.number().required("La utilidad es obligatoria"),
  Id_estado_venta: yup.number().required("El id del estado de venta es obligatorio"),
});

export { SellSchema }