"use server"

import { SignInSchema, SignUpSchema } from "@/lib/schemas/authSchema"
import { signIn, signUp } from "@/lib/requests"
import { cookies } from "next/headers"

export const handleSignIn = async (data: SignInSchema) => {
  const response = await signIn(data)

  if (response && !("error" in response)) {
    const cookieStore = await cookies()

    cookieStore.set({
      name: process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN || "access_token",
      value: response.access,
      httpOnly: true,
      maxAge: 86400, // 1 dia
    })

    cookieStore.set({
      name: process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN || "refresh_token",
      value: response.refresh,
      httpOnly: true,
      maxAge: 604800, // 7 dia
    })
  }
  return response
}

export const handleSignUp = async (data: SignUpSchema) => {
  const response = await signUp(data)

  if (response && !("error" in response)) {
    const cookieStore = await cookies()

    cookieStore.set({
      name: process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN || "access_token",
      value: response.access,
      httpOnly: true,
      maxAge: 86400, // 1 dia
    })

    cookieStore.set({
      name: process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN || "refresh_token",
      value: response.refresh,
      httpOnly: true,
      maxAge: 604800, // 7 dia
    })
  }
  return response
}
