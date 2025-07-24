import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../../../../lib/auth"

const prisma = new PrismaClient()

interface PatchRequestBody {
  action: 'approve' | 'reject'
  reviewComment?: string
  reviewerId?: number
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: PatchRequestBody = await request.json()
    const { action, reviewComment, reviewerId } = body
    const requestId = parseInt(params.id)

    // Validate request ID
    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      )
    }

    // Validate action
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Get the access request
    const accessRequest = await prisma.accessRequest.findUnique({
      where: { id: requestId },
      include: {
        requestedRole: true,
        department: true
      }
    })

    if (!accessRequest) {
      return NextResponse.json(
        { error: "Access request not found" },
        { status: 404 }
      )
    }

    if (accessRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: "Access request has already been processed" },
        { status: 400 }
      )
    }

    // Update the access request status
    const updatedRequest = await prisma.accessRequest.update({
      where: { id: requestId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
        reviewedBy: reviewerId || null
      }
    })

    // If approved, create the user account
    if (action === 'approve') {
      try {
        // Generate a default password
        const defaultPassword = "Welcome@123" // User will need to change this on first login
        const hashedPassword = await hashPassword(defaultPassword)

        console.log("Creating user with data:", {
          employeeId: accessRequest.employeeId,
          firstName: accessRequest.firstName,
          lastName: accessRequest.lastName,
          email: accessRequest.email,
          roleId: accessRequest.requestedRoleId,
          departmentId: accessRequest.departmentId
        })

        // Create the user account
        const user = await prisma.user.create({
          data: {
            employeeId: accessRequest.employeeId,
            firstName: accessRequest.firstName,
            lastName: accessRequest.lastName,
            email: accessRequest.email,
            phone: accessRequest.phone || null,
            password: hashedPassword,
            roleId: accessRequest.requestedRoleId,
            departmentId: accessRequest.departmentId,
            isActive: true,
            profileColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            profileInitials: `${accessRequest.firstName[0]}${accessRequest.lastName[0]}`.toUpperCase()
          }
        })

        console.log("User created successfully:", {
          id: user.id,
          employeeId: user.employeeId,
          isActive: user.isActive,
          hasPassword: !!user.password
        })

        return NextResponse.json({
          success: true,
          message: `Access request ${action}d successfully and user account created`,
          userId: user.id,
          defaultPassword: defaultPassword
        })

      } catch (userCreationError) {
        console.error("Error creating user account:", userCreationError)
        
        // Revert the access request status if user creation fails
        await prisma.accessRequest.update({
          where: { id: requestId },
          data: {
            status: 'PENDING',
            reviewedAt: null,
            reviewComment: "Failed to create user account. Please try again.",
            reviewedBy: null
          }
        })

        return NextResponse.json(
          { 
            error: "Failed to create user account after approval",
            details: userCreationError instanceof Error ? userCreationError.message : "Unknown error"
          },
          { status: 500 }
        )
      }
    }

    // For rejection, just return success
    return NextResponse.json({
      success: true,
      message: `Access request ${action}d successfully`
    })

  } catch (error) {
    console.error("Access request update error:", error)
    return NextResponse.json(
      { 
        error: "Failed to update access request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id)

    // Validate request ID
    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      )
    }

    // Get the access request with related data
    const accessRequest = await prisma.accessRequest.findUnique({
      where: { id: requestId },
      include: {
        requestedRole: true,
        department: true,
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!accessRequest) {
      return NextResponse.json(
        { error: "Access request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: accessRequest
    })

  } catch (error) {
    console.error("Access request fetch error:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch access request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}