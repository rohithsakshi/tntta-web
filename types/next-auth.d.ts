import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tnttaId: string
      role: UserRole
      contact: string
      firstName: string
      lastName: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    tnttaId: string
    role: UserRole
    contact: string
    firstName: string
    lastName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    tnttaId: string
    role: UserRole
    contact: string
    firstName: string
    lastName: string
  }
}
