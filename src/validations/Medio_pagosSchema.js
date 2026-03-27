import * as yup from "yup";

const CreateMedio_pagosSchema = yup.object({
  Nombre_pago: yup.string().required("El nombre de pago es obligatorio").max(40),
});

const UpdateMedio_pagosSchema = yup.object({
  Nombre_pago: yup.string().required("El nombre de pago es obligatorio").max(40),
});

export { CreateMedio_pagosSchema, UpdateMedio_pagosSchema};