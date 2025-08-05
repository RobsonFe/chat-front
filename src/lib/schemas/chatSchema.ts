"use client"
import { email, z } from "zod"

export const newChatSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

export type NewChatSchema = z.infer<typeof newChatSchema>
