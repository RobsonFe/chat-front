import { SignInSchema, SignUpSchema } from "@/lib/schemas/authSchema"
import { api } from "@/lib/api"
import { UserUpdate } from "@/types/User"
import { APICreateChat, APIDeleteChat, APIGetChats } from "@/types/Chat"
import { NewChatSchema } from "./schemas/chatSchema"
import {
  APICreateMessage,
  APIDeleteMessage,
  APIGetMessages,
} from "@/types/Message"
import { Auth } from "@/types/Auth"

export const signIn = async (data: SignInSchema) => {
  return await api<Auth>({
    endpoint: "accounts/signin",
    method: "POST",
    data,
    withAuth: false,
  })
}

export const signUp = async (data: SignUpSchema) => {
  return await api<SignUpSchema>({
    endpoint: "accounts/signup",
    method: "POST",
    data,
    withAuth: false,
  })
}

export const signOut = async () => {
  return await api<Auth>({
    endpoint: "accounts/signout",
    method: "POST",
    withAuth: true,
  })
}

export const updateUser = async (data: Partial<FormData>) => {
  return await api<UserUpdate>({
    endpoint: "accounts/user",
    method: "PATCH",
    data,
    withAuth: true,
    withAttachments: true,
  })
}

export const getChats = async () => {
  return await api<APIGetChats>({
    endpoint: "chats",
    method: "GET",
    withAuth: true,
  })
}

export const createChat = async (data: NewChatSchema) => {
  return await api<APICreateChat>({
    endpoint: "chats",
    method: "POST",
    data,
    withAuth: true,
  })
}

export const deleteChat = async (chat_id: number) => {
  return await api<APIDeleteChat>({
    endpoint: `chats/${chat_id}`,
    method: "DELETE",
    withAuth: true,
  })
}

export const getChatMessages = async (chat_id: number) => {
  return await api<APIGetMessages>({
    endpoint: `chats/messages/${chat_id}`,
    method: "GET",
    withAuth: true,
  })
}

export const createChatMessage = async (chat_id: number, data: FormData) => {
  return await api<APICreateMessage>({
    endpoint: `chats/messages/${chat_id}`,
    method: "POST",
    data,
    withAuth: true,
    withAttachments: true,
  })
}

export const deleteChatMessage = async (
  chat_id: number,
  message_id: number
) => {
  return await api<APIDeleteMessage>({
    endpoint: `chats/${chat_id}/messages/${message_id}`,
    method: "DELETE",
    withAuth: true,
  })
}
