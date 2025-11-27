import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json()

    console.log(`🔍 DEBUG: Login attempt - Employee ID: ${employeeId}, Password provided: ${!!password}`)

    if (!employeeId || !password) {
      console.log(`❌ DEBUG: Missing credentials - Employee ID: ${!!employeeId}, Password: ${!!password}`)
      return NextResponse.json({ error: "Employee ID and password are required" }, { status: 400 })
    }

    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ DEBUG: Database connected')
    } catch (dbError) {
      console.error('❌ DEBUG: Database connection failed:', dbError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    })

    if (!user) {
      console.log(`❌ DEBUG: User not found for Employee ID: ${employeeId}`)
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    console.log(`✅ DEBUG: User found: ${user.firstName} ${user.lastName} (${user.employeeId})`)
    console.log(`✅ DEBUG: User active: ${user.isActive}`)
    console.log(`✅ DEBUG: Password hash exists: ${!!user.password}`)

    if (!user.password) {
      console.log(`❌ DEBUG: User ${employeeId} has no password set`)
      return NextResponse.json({ error: "User has no password" }, { status: 401 })
    }

    // Test password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log(`🔑 DEBUG: Password validation result: ${isPasswordValid}`)
    
    if (!isPasswordValid) {
      console.log(`❌ DEBUG: Invalid password for user: ${employeeId}`)
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    if (!user.isActive) {
      console.log(`❌ DEBUG: User ${employeeId} is not active`)
      return NextResponse.json({ error: "User is not active" }, { status: 401 })
    }

    console.log(`✅ DEBUG: Authentication successful for: ${user.employeeId} - ${user.firstName} ${user.lastName}`)

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        department: user.department?.name || 'Unknown',
        isActive: true,
      },
    })

  } catch (error) {
    console.error('❌ DEBUG: Authentication error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 