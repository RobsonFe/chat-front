import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { handleGetUser } from "@/lib/server/auth"
import Providers from "@/components/layouts/Providers"
import { MainLayout } from "@/components/layouts/MainLayout"

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | Sistema de Chat",
    default: "Home | Sistema de Chat",
  },
  description:
    "Sistema de Chat desenvolvido com Next.js, TypeScript e Tailwind CSS",
  authors: [
    {
      name: "Robson Ferreira",
      url: "https://github.com/RobsonFe",
    },
  ],
  icons: {
    icon: "/grftalk.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await handleGetUser()
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <MainLayout user={user}>{children}</MainLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
