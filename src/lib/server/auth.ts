"use server"

import { SignInSchema, SignUpSchema } from "@/lib/schemas/authSchema"
import { signIn, signUp, signOut } from "@/lib/requests"
import { cookies } from "next/headers"
import { User } from "@/types/User"

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
      maxAge: 604800, // 7 dias
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
      maxAge: 604800, // 7 dias
    })
  }
  return response
}

export const handleSignOut = async () => {
  const cookieStore = await cookies()

  const refreshTokenCookie = cookieStore.get(
    process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN || "refresh_token"
  )

  if (refreshTokenCookie?.value) {
    try {
      await signOut(refreshTokenCookie.value)
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error)
    }
  }

  cookieStore.delete(
    process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN || "access_token"
  )
  cookieStore.delete(
    process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN || "refresh_token"
  )

  return { success: true }
}

export const handleGetUser = async (): Promise<User | null> => {
  const authCookie = (await cookies()).get(
    process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN || "access_token"
  )?.value

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/accounts/user`,
    {
      headers: {
        Authorization: `Bearer ${authCookie}`,
        "Content-Type": "application/json",
      },
    }
  )

  const jsonResponse = await response.json()

  const user = jsonResponse.user

  if (user) return user as User

  return null
}
