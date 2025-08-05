"use client"
import { z } from "zod"

export const newChatSchema = z.object({
  email: z.email({
    message: "Email inválido",
  }),
})

export type NewChatSchema = z.infer<typeof newChatSchema>
