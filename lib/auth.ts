import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
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
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    })

    if (!user || !user.password) {
      return null
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    if (!user.isActive) {
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