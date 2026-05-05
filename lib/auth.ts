import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        contact: { label: "Contact Number", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.contact || !credentials?.password) {
          return null
        }

        // Hardcoded Admin Fallback for Demo/Emergency Access
        if (credentials.contact === "9999999999" && credentials.password === "Admin@123") {
          return {
            id: "admin-readme",
            tnttaId: "TNTTA-ADMIN",
            role: UserRole.ADMIN,
            contact: "9999999999",
            firstName: "TNTTA",
            lastName: "Admin",
            email: "admin@tntta.com",
          }
        }

        try {
          const user = await prisma.user.findUnique({
            where: { contact: credentials.contact as string }
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)

          if (!isValid) {
            return null
          }

          if (credentials.role && user.role !== credentials.role) {
            return null
          }

          return {
            id: user.id,
            tnttaId: user.tnttaId,
            role: user.role,
            contact: user.contact,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        } catch (error: any) {
          console.error("Authentication error:", error)
          
          // Fallback for Demo / DB Offline
          if (error.message?.includes("Can't reach database") || error.code === "P1001") {
            console.warn("DATABASE OFFLINE: Allowing demo player login.")
            return {
              id: "demo-player-id",
              tnttaId: "TNTTA-DEMO",
              role: UserRole.PLAYER,
              contact: credentials.contact as string,
              firstName: "Demo",
              lastName: "Player",
              email: "player@demo.com",
            }
          }
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tnttaId = user.tnttaId
        token.role = user.role
        token.contact = user.contact
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.tnttaId = token.tnttaId as string
        session.user.role = token.role as UserRole
        session.user.contact = token.contact as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})

export const getCurrentUser = async () => {
  const session = await auth()
  return session?.user
}

export const requireAdmin = async () => {
  const user = await getCurrentUser()
  if (user?.role !== UserRole.ADMIN) {
    throw new Error("Admin access required")
  }
  return user
}

export const requirePlayer = async () => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}
