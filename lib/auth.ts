import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthUser {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user: AuthUser): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key'
  return jwt.sign(
    {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department
    },
    secret,
    { expiresIn: '7d' }
  )
}

export const verifyToken = (token: string): AuthUser | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const decoded = jwt.verify(token, secret) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

export const authenticateUser = async (employeeId: string, password: string) => {
  try {
    console.log(`🔍 Authentication attempt for Employee ID: ${employeeId}`)
    
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    })

    if (!user) {
      console.log(`❌ User not found for Employee ID: ${employeeId}`)
      return null
    }

    if (!user.password) {
      console.log(`❌ User ${employeeId} has no password set`)
      return null
    }

    console.log(`✅ User found: ${user.firstName} ${user.lastName} (${user.employeeId})`)
    console.log(`✅ User active: ${user.isActive}`)
    console.log(`✅ Password hash exists: ${!!user.password}`)

    const isPasswordValid = await verifyPassword(password, user.password)
    console.log(`🔑 Password validation result: ${isPasswordValid}`)
    
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for user: ${employeeId}`)
      return null
    }

    if (!user.isActive) {
      console.log(`❌ User ${employeeId} is not active`)
      return null
    }

    // Return user data with safe string handling
    return {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      department: user.department?.name || 'Unknown',
      isActive: user.isActive
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export const getUserFromToken = async (token: string) => {
  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: true,
        department: true
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      department: user.department?.name || 'Unknown',
      isActive: user.isActive,
      profileColor: user.profileColor || '#ef4444'
    }
  } catch (error) {
    console.error('Get user from token error:', error)
    return null
  }
}