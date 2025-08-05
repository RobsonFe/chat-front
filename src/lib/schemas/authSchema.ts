"use client"

import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
})
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
      .max(80, { message: "Nome deve ter no máximo 80 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "Senha obrigatória" })
      .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/, {
        message:
          "A senha deve conter pelo menos uma letra, um número e um caractere especial",
      })
      .max(80, { message: "Senha muito grande" }),
    confirmPassword: z.string().min(6, {
      message: "Confirmação de senha deve ter pelo menos 6 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type SignInSchema = z.infer<typeof signInSchema>
export type SignUpSchema = z.infer<typeof signUpSchema>
