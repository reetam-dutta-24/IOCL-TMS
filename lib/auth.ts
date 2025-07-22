import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "./prisma"

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
    console.log("🔍 Exact search parameters:")
    console.log("  - employeeId:", JSON.stringify(employeeId))
    console.log("  - employeeId length:", employeeId.length)
    console.log("  - password:", JSON.stringify(password))
    
    // First, let's see all users in database
    const allUsers = await prisma.user.findMany({
      select: { employeeId: true, isActive: true, firstName: true }
    })
    console.log("🔍 All users in database:", allUsers)
    
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true,
      },
    })

    console.log("🔍 Database query result:", {
      found: !!user,
      isActive: user?.isActive,
      hasPassword: !!user?.password,
      hasRole: !!user?.role,
      roleName: user?.role?.name,
      actualEmployeeId: user?.employeeId
    })

    if (!user) {
      console.log("❌ User not found in database")
      return null
    }

    if (!user.isActive) {
      console.log("❌ User account is inactive")
      return null
    }

    console.log("🔍 About to verify password...")
    console.log("🔍 Input password:", password)
    console.log("🔍 Stored hash (first 20 chars):", user.password.substring(0, 20) + "...")
    
    const isValid = await verifyPassword(password, user.password)
    console.log("🔍 Password verification result:", isValid)
    
    if (!isValid) {
      console.log("❌ Password verification failed")
      return null
    }

    console.log("✅ Authentication successful, updating last login...")

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    console.log("✅ Returning user data")

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
    console.error("💥 Authentication error:", error)
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