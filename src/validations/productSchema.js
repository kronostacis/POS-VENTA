import * as yup from "yup";

export const CreateProductSchema = yup.object().shape({
  Nombre: yup
    .string()
    .required("El nombre del producto es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres"),

  Precio_venta: yup
    .number()
    .typeError("El precio debe ser un número")
    .required("El precio de venta es obligatorio")
    .positive("El precio debe ser mayor a cero"),
});

 const UpdateProductSchema = yup.object({
  Nombre: yup.string().max(40),
  Precio_venta: yup.number().typeError("Debe ser un número"),
});

export { UpdateProductSchema };
