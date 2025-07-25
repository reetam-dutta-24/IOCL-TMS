import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, AccessRequestStatus } from "@prisma/client"
import { hashPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id)

    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      )
    }

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
    console.error("Error fetching access request:", error)
    return NextResponse.json(
      { error: "Failed to fetch access request" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, reviewComment, reviewerId } = await request.json()
    const requestId = parseInt(params.id)

    // Validate input
    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      )
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Get the access request with related data
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

    // Check if request is still pending
    if (accessRequest.status !== AccessRequestStatus.PENDING) {
      return NextResponse.json(
        { error: "Access request has already been processed" },
        { status: 400 }
      )
    }

    // Validate reviewer ID if provided
    if (reviewerId) {
      const reviewer = await prisma.user.findUnique({
        where: { id: reviewerId }
      })

      if (!reviewer) {
        return NextResponse.json(
          { error: "Invalid reviewer ID" },
          { status: 400 }
        )
      }
    }

    // Update the access request status
    const updatedRequest = await prisma.accessRequest.update({
      where: { id: requestId },
      data: {
        status: action === 'approve' ? AccessRequestStatus.APPROVED : AccessRequestStatus.REJECTED,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
        reviewedBy: reviewerId || null
      }
    })

    // If approved, create the user account
    if (action === 'approve') {
      try {
        // Check if user with this employee ID or email already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { employeeId: accessRequest.employeeId },
              { email: accessRequest.email }
            ]
          }
        })

        if (existingUser) {
          // Revert the access request status
          await prisma.accessRequest.update({
            where: { id: requestId },
            data: {
              status: AccessRequestStatus.PENDING,
              reviewedAt: null,
              reviewComment: "User with this employee ID or email already exists",
              reviewedBy: null
            }
          })

          return NextResponse.json(
            { error: "User with this employee ID or email already exists" },
            { status: 409 }
          )
        }

        // Generate a secure default password
        const defaultPassword = "Welcome@123" // User should change on first login
        const hashedPassword = await hashPassword(defaultPassword)

        console.log("Creating user with data:", {
          employeeId: accessRequest.employeeId,
          firstName: accessRequest.firstName,
          lastName: accessRequest.lastName,
          email: accessRequest.email,
          roleId: accessRequest.requestedRoleId,
          departmentId: accessRequest.departmentId
        })

        // Create the new user account
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
            emailVerified: false, // User should verify email on first login
            profileColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            profileInitials: `${accessRequest.firstName[0]}${accessRequest.lastName[0]}`.toUpperCase()
          },
          include: {
            role: true,
            department: true
          }
        })

        console.log("User created successfully:", {
          id: user.id,
          employeeId: user.employeeId,
          isActive: user.isActive,
          roleName: user.role.name
        })

        return NextResponse.json({
          success: true,
          message: `Access request approved successfully and user account created`,
          data: {
            requestId: updatedRequest.id,
            userId: user.id,
            employeeId: user.employeeId,
            defaultPassword: defaultPassword, // In production, send this via secure email
            userRole: user.role.name,
            userDepartment: user.department?.name
          }
        })

      } catch (userCreationError) {
        console.error("Error creating user account:", userCreationError)
        
        // Revert the access request status if user creation fails
        await prisma.accessRequest.update({
          where: { id: requestId },
          data: {
            status: AccessRequestStatus.PENDING,
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

    // For rejection case
    return NextResponse.json({
      success: true,
      message: `Access request ${action}d successfully`,
      data: {
        requestId: updatedRequest.id,
        status: updatedRequest.status,
        reviewComment: updatedRequest.reviewComment
      }
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
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id)

    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      )
    }

    // Check if request exists and is deletable (only pending requests)
    const accessRequest = await prisma.accessRequest.findUnique({
      where: { id: requestId }
    })

    if (!accessRequest) {
      return NextResponse.json(
        { error: "Access request not found" },
        { status: 404 }
      )
    }

    if (accessRequest.status !== AccessRequestStatus.PENDING) {
      return NextResponse.json(
        { error: "Only pending access requests can be deleted" },
        { status: 400 }
      )
    }

    // Delete the access request
    await prisma.accessRequest.delete({
      where: { id: requestId }
    })

    return NextResponse.json({
      success: true,
      message: "Access request deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting access request:", error)
    return NextResponse.json(
      { error: "Failed to delete access request" },
      { status: 500 }
    )
  }
}