import { NextRequest, NextResponse } from "next/server"
import { handleGetUser } from "@/lib/server/auth"

export async function middleware(request: NextRequest) {
  const user = await handleGetUser()
  // Se não estiver logado
  if (!request.nextUrl.pathname.startsWith("/auth") && !user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }
  // Se estiver logado
  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: "/((?!.*\\..*|_next).*)",
}
