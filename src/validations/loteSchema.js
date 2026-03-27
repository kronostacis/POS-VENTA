import * as yup from "yup";

const CreateLoteSchema = yup.object().shape({
  Id_producto: yup
    .number()
    .typeError("El id del producto debe ser un número")
    .required("El id del producto es obligatorio"),

  Precio_compra: yup
    .number()
    .typeError("El precio debe ser un número")
    .required("El precio de compra es obligatorio")
    .positive("El precio debe ser mayor a cero"),

  Cantidad: yup
    .number()
    .typeError("La cantidad debe ser un número")
    .required("La cantidad es obligatoria")
    .positive("La cantidad debe ser mayor a cero"),

  Fecha: yup
    .date()
    .typeError("La fecha es inválida")
    .required("La fecha es obligatoria"),
});


export const UpdateLoteSchema = yup.object({
  Cantidad: yup
    .number()
    .required("La cantidad es obligatoria")
    .typeError("La cantidad debe ser un número"),

  Stock: yup
    .number()
    .required("El stock es obligatorio")
    .typeError("El stock debe ser un número")
    .max(
      yup.ref("Cantidad"),
      "El stock no puede ser mayor que la cantidad total del lote"
    ),
});

export const UpdateLoteStock = yup.object({
  Stock: yup
    .number()
    .required("El stock es obligatorio")
    .typeError("El stock debe ser un número")
    .max(
      yup.ref("Cantidad"),
      "El stock no puede ser mayor que la cantidad total del lote"
    ),
});



export { CreateLoteSchema };
