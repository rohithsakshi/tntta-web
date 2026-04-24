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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.contact || !credentials?.password) {
          return null
        }

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

        return {
          id: user.id,
          tnttaId: user.tnttaId,
          role: user.role,
          contact: user.contact,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
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
