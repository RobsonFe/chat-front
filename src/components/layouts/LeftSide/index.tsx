import { useChatStore } from "@/stores/chatStore"
import { useAuthStore } from "@/stores/authStore"
import { useEffect, useState } from "react"
import { Chat, UpdateChatEvent } from "@/types/Chat"
import { getChats } from "@/lib/requests"
import { toast } from "sonner"
import { socket } from "../Providers"

type Props = {
  variant?: "mobile" | "desktop"
}

export const LeftSide = ({ variant = "desktop" }: Props) => {
  const {
    chat: currentChat,
    chats,
    setChats,
    setChat,
    setShowNewChat,
  } = useChatStore()

  const { user } = useAuthStore()

  const [queryInput, setQueryInput] = useState<string>("")
  const [chatFiltered, setChatFiltered] = useState<Chat[]>([])

  const handleGetChats = async () => {
    const response = await getChats()

    if ("error" in response) {
      console.error("Erro ao buscar chats:", response.error.message)
      return
    }
    setChats(response.results)
  }

  const handleFilterChats = () => {
    if (!chats) return

    setChatFiltered(
      chats.filter((chat) =>
        chat.user.name.toLowerCase().includes(queryInput.toLowerCase())
      )
    )
  }

  useEffect(() => {
    handleGetChats()
  }, [])

  useEffect(() => {
    if (!queryInput && chats) setChatFiltered(chats)
  }, [chats])

  useEffect(() => {
    const handleUpdateChat = (data: UpdateChatEvent) => {
      if (user && data.query.users.includes(user.id)) {
        handleGetChats()
      }

      if (data.type === "delete" && currentChat?.id === data.query.chat_id) {
        setChat(null)
        toast.info("A conversa foi excluída.", { position: "top-right" })
      }
    }

    socket.on("update_chat", handleUpdateChat)

    return () => {
      socket.off("update_chat", handleUpdateChat)
    }
  }, [currentChat])
}
