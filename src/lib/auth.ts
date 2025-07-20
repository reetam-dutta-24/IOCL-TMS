import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        employeeId: { label: "Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.employeeId || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { employeeId: credentials.employeeId },
            include: { role: true, department: true },
          })

          if (!user || !user.isActive) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id.toString(),
            employeeId: user.employeeId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role.name,
            department: user.department?.name || null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.employeeId = user.employeeId
        token.role = user.role
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.employeeId = token.employeeId as string
        session.user.role = token.role as string
        session.user.department = token.department as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}
