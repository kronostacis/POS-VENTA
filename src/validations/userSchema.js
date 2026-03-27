import * as yup from "yup";

// Esquema de validación con Yup
const CreateUserSchema = yup.object({
  Id_usuario: yup
    .number("Debe ser un rut")
    .required("El usuario es obligatorio"),
  Nombre: yup.string().required("El nombre es obligatorio").max(40),
  Apellido_1: yup.string().required("El apellido es obligatorio").max(40),
  Apellido_2: yup.string().required("El apellido es obligatorio").max(40),
  Cargo: yup
    .number("El cargo es obligatorio")
    .required("El cargo es obligatorio"),
});

const UpdateUserSchema = yup.object({
  Nombre: yup.string().required("El nombre es obligatorio").max(40),
  Apellido_1: yup.string().required("El apellido es obligatorio").max(40),
  Apellido_2: yup.string().required("El apellido es obligatorio").max(40),
  Cargo: yup.number().required("El cargo es obligatorio"),
});

const ChangePasswordSchema = yup.object({
  Contrasena: yup
    .string()
    .required("La contraseña es obligatorio")
    .min(6)
    .max(40),
  Nueva_contrasena: yup
    .string()
    .required("La nueva contraseña es obligatorio")
    .min(6)
    .max(40),
});

export { CreateUserSchema, UpdateUserSchema, ChangePasswordSchema };
