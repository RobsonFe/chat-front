import { Attachment } from "./Attachments"
import { User } from "./User"

export type Message = {
  id: number
  body: string | null
  attachment: Attachment | null
  from_user: User
  viewed_at: string | null
  created_at: string
}

export type APIGetMessages = {
  results: Message[]
}

export type APICreateMessage = {
  result: Message
}

export type APIDeleteMessage = {
  success?: boolean
}

export type UpdateMessageEvent = {
  type: "create" | "delete"
  message?: Message
  query: {
    chat_id: number
    message_id?: number
  }
}

export type MarkMessageAsReadEvent = {
  query: {
    chat_id: number
    exclude_user_id: number
  }
}
