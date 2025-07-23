import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, reviewComment, reviewerId } = await request.json()
    const requestId = parseInt(params.id)

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
        // Generate a default password or use the one from the request
        const defaultPassword = "Welcome@123" // User will need to change this on first login
        const hashedPassword = await hashPassword(defaultPassword)

        console.log("Creating user with data:", {
          employeeId: accessRequest.employeeId,
          firstName: accessRequest.firstName,
          lastName: accessRequest.lastName,
          email: accessRequest.email,
          roleId: accessRequest.requestedRoleId,
          departmentId: accessRequest.departmentId,
          defaultPassword: defaultPassword
        })

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
            profileColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
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
          { error: "Failed to create user account after approval" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `Access request ${action}d successfully`
    })

  } catch (error) {
    console.error("Access request update error:", error)
    return NextResponse.json(
      { error: "Failed to update access request" },
      { status: 500 }
    )
  }
}