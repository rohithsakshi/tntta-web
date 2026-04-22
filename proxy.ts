import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const role = req.auth?.user?.role

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
}
