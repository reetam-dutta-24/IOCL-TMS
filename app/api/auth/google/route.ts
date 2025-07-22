import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateToken } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { googleToken, userData } = await request.json()

    // Verify Google token (you'd use Google's API for this)
    // For now, we'll assume the userData is valid

    const { email, name, googleId, picture } = userData

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { googleId: googleId }
        ]
      },
      include: {
        role: true,
        department: true
      }
    })

    if (!user) {
      // Create new user with Google account
      const [firstName, ...lastNameParts] = name.split(' ')
      const lastName = lastNameParts.join(' ') || ''

      // Assign default role (you might want to create an access request instead)
      const defaultRole = await prisma.role.findFirst({
        where: { name: 'Trainee' }
      })

      if (!defaultRole) {
        return NextResponse.json(
          { error: "Default role not found" },
          { status: 500 }
        )
      }

      user = await prisma.user.create({
        data: {
          employeeId: `GOOGLE_${Date.now()}`, // Generate unique employee ID
          firstName,
          lastName,
          email,
          googleId,
          roleId: defaultRole.id,
          isActive: true, // You might want to require admin approval
          emailVerified: true,
          profileColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
          profileInitials: `${firstName[0]}${lastName[0] || firstName[1] || ''}`.toUpperCase()
        },
        include: {
          role: true,
          department: true
        }
      })
    } else if (!user.googleId) {
      // Link existing account with Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: { 
          googleId,
          emailVerified: true 
        },
        include: {
          role: true,
          department: true
        }
      })
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is not active. Please contact administrator." },
        { status: 403 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Generate JWT token with all required fields
    const token = generateToken({
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role?.name || 'Unknown',
      department: user.department?.name || 'Unknown'
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role?.name || 'Unknown',
        department: user.department?.name || "Unknown",
        profileColor: user.profileColor,
        profileInitials: user.profileInitials
      }
    })

  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}