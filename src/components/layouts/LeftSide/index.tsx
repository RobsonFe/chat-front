import { useChatStore } from "@/stores/chatStore"
import { useAuthStore } from "@/stores/authStore"
import { useEffect, useState } from "react"
import { Chat, UpdateChatEvent } from "@/types/Chat"
import { getChats } from "@/lib/requests"
import { toast } from "sonner"
import { socket } from "../Providers"
import { NewChat } from "./NewChat"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "dayjs"

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

  return (
    <div
      className={`bg-slate-100 dark:bg-slate-900 border-r border-slate-50 dark:border-slate-800 ${
        variant === "mobile" ? "w-auto" : "w-96"
      } h-app overflow-auto`}
    >
      <NewChat />

      <div className=" px-3 py-1 sticky top-0 bg-slate-100 dark:bg-slate-900 z-20">
        <div className="flex gap-2 items-center my-5">
          <Input
            type="search"
            placeholder="Buscar mensagens"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <Button variant="outline" onClick={handleFilterChats}>
            <Search className="size-4" strokeWidth={3} />
          </Button>
        </div>
        <Button
          size={"sm"}
          className="text-slate-100 gap-2 w-full"
          onClick={() => setShowNewChat(true)}
        >
          <Plus className="size-5" />
          <span className="text-sm">Nova Conversa</span>
        </Button>
      </div>
      <div className="mt-5">
        {chatFiltered.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-4 py-4 px-3 ${
              chat.id === currentChat?.id
                ? "bg-slate-200 dark:bg-slate-800"
                : ""
            } hover:bg-slate-200 dark:bg-slate-700 cursor-pointer transition-colors duration-200`}
            onClick={() => setChat(chat)}
          >
            <Avatar
              className="size-[46px]"
              isOnline={dayjs()
                .subtract(5, "minute")
                .isBefore(chat.user.last_access)}
            >
              <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
              <AvatarFallback>{chat.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1 truncate">
              <div className="flex items-center justify-between gap-4">
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate text-ellipsis">
                  {chat.user.name}
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {dayjs(chat.viewed_at || chat.created_at).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
