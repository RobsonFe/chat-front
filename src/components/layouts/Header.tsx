import { useAuthStore } from "@/stores/authStore"
import { useChatStore } from "@/stores/chatStore"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

export const Header = () => {
  const { setTheme } = useTheme()
  const { user, clearUser } = useAuthStore()
  const { setChat, showChatsList, setShowChatsList } = useChatStore()
  const pathname = usePathname()

  const handleLogout = () => {
    handleLogout()
    clearUser()
    setChat(null)
    toast.success("Usuário Deslogado com sucesso", { position: "top-right" })
  }

  return (
    <header className="h-header px-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-50 dark:border-b-slate-800">
      <nav></nav>
    </header>
  )
}
