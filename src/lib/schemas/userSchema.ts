import { z } from "zod"

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Nome é obrigatório" })
      .max(80, { message: "Nome deve ter no máximo 80 caracteres" }),
    email: z.email({ message: "Email inválido" }).max(250, {
      message: "Email deve ter no máximo 250 caracteres",
    }),
    password: z
      .string()
      .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
      .refine(
        (val) => {
          // Verifica se a senha contém pelo menos uma letra maiúscula, uma minúscula e um número
          if (!val) return false
          return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/.test(val)
        },
        {
          message:
            "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
        }
      ),
    confirmPassword: z.string().min(6, {
      message: "Confirmação de senha deve ter pelo menos 6 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
