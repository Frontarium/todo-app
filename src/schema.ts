import * as yup from "yup";

export const taskSchema = yup
  .object({
    title: yup
      .string()
      .trim()
      .required("Название обязательно")
      .min(2, "Минимум 2 символа"),
    description: yup.string().trim().max(500, "Слишком длинно").default(""),
  })
  .required();

export type TaskFormShape = yup.InferType<typeof taskSchema>;
