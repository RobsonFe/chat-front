"use client"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"
import dayjs from "dayjs"
import { io } from "socket.io-client"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import "dayjs/locale/pt-br"

export const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
  transports: ["websocket"],
})

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    dayjs.locale("pt-br")
    socket.on("connect", () => {
      console.log("Conectado ao servidor WebSocket")
    })
    socket.on("disconnect", () => {
      console.log("Desconectado do servidor WebSocket")
    })
    return () => {
      socket.off("connect")
      socket.off("disconnect")
    }
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <ProgressBar height="4px" color="#493cdd" shallowRouting />
      <Toaster />
      {children}
    </ThemeProvider>
  )
}
export default Providers
