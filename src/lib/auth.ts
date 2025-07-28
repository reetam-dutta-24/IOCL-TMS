import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export interface AuthUser {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcryptjs.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticateUser(employeeId: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return null
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      department: user.department?.name || "Unknown",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function createUser(userData: {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  password: string
  roleId: number
  departmentId?: number | null
  phone?: string
}): Promise<AuthUser | null> {
  try {
    const hashedPassword = await hashPassword(userData.password)

    const user = await prisma.user.create({
      data: {
        employeeId: userData.employeeId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        roleId: userData.roleId,
        departmentId: userData.departmentId,
        phone: userData.phone,
      },
      include: {
        role: true,
        department: true,
      },
    })

    return {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      department: user.department?.name || "Unknown",
    }
  } catch (error) {
    console.error("User creation error:", error)
    return null
  }
}

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

        const user = await authenticateUser(credentials.employeeId, credentials.password)
        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.employeeId = user.employeeId
        token.role = user.role
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number
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
  secret: process.env.NEXTAUTH_SECRET || JWT_SECRET,
}