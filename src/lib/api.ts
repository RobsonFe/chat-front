"use server"
import axios, { AxiosError } from "axios"
import { ApiError } from "@/types/Api"
import { cookies } from "next/headers"

type Props = {
  endpoint: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  data?: any
  withAuth?: boolean
  withAttachments?: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1"

export const api = async <TypeResponse>({
  endpoint,
  method,
  data,
  withAuth = true,
  withAttachments = false,
}: Props) => {
  const instance = axios.create({
    baseURL: BASE_URL,
  })

  if (withAuth) {
    const sessionAuth = (await cookies()).get(
      process.env.NEXT_PUBLIC_API_BASE_URL as string
    )

    if (sessionAuth?.value) {
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${sessionAuth.value}`
    }
  }

  if (withAttachments) {
    instance.defaults.headers.common["Content-Type"] = "multipart/form-data"
  } else {
    instance.defaults.headers.common["Content-Type"] = "application/json"
  }

  try {
    const response = await instance.request<TypeResponse>({
      url: endpoint,
      method,
      params: method === "GET" && data,
      data: method !== "GET" && data,
    })
    return response.data
  } catch (error) {
    const e = error as AxiosError<ApiError>

    return {
      error: {
        message: e.response?.data.detail || "Erro ao processar requisição",
      },
    }
  }
}
