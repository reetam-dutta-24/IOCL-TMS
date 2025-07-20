import { prisma } from "@/lib/prisma"
import { sendNotification } from "@/lib/notifications"

export class WorkflowEngine {
  static async processInternshipRequest(requestId: number) {
    try {
      const request = await prisma.internshipRequest.findUnique({
        where: { id: requestId },
        include: {
          submitter: true,
          department: true,
        },
      })

      if (!request) {
        throw new Error("Request not found")
      }

      // Auto-assign to L&D Coordinator for initial review
      const ldCoordinators = await prisma.user.findMany({
        where: {
          role: { name: "L&D Coordinator" },
          isActive: true,
        },
      })

      if (ldCoordinators.length > 0) {
        // Create approval record
        await prisma.approval.create({
          data: {
            internshipRequestId: requestId,
            approverId: ldCoordinators[0].id,
            level: 1,
            status: "PENDING",
          },
        })

        // Update request status
        await prisma.internshipRequest.update({
          where: { id: requestId },
          data: { status: "UNDER_REVIEW" },
        })

        // Send notification
        await sendNotification({
          userId: ldCoordinators[0].id,
          type: "EMAIL",
          subject: `New Internship Request - ${request.requestNumber}`,
          message: `A new internship request has been submitted and requires your review.`,
          templateType: "NEW_REQUEST",
          templateData: request,
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Error processing internship request:", error)
      throw error
    }
  }

  static async assignMentor(requestId: number, mentorId?: number) {
    try {
      const request = await prisma.internshipRequest.findUnique({
        where: { id: requestId },
        include: { department: true },
      })

      if (!request) {
        throw new Error("Request not found")
      }

      let selectedMentor

      if (mentorId) {
        // Manual assignment
        selectedMentor = await prisma.user.findUnique({
          where: { id: mentorId },
        })
      } else {
        // Auto-assignment logic
        const availableMentors = await prisma.user.findMany({
          where: {
            role: { name: "Mentor" },
            departmentId: request.preferredDepartment,
            isActive: true,
          },
          include: {
            mentorAssignments: {
              where: { status: "ACTIVE" },
            },
          },
        })

        // Find mentor with least current assignments
        selectedMentor = availableMentors.reduce((prev, current) => {
          return prev.mentorAssignments.length <= current.mentorAssignments.length ? prev : current
        })
      }

      if (!selectedMentor) {
        throw new Error("No available mentor found")
      }

      // Create mentor assignment
      await prisma.mentorAssignment.create({
        data: {
          internshipRequestId: requestId,
          mentorId: selectedMentor.id,
          status: "ACTIVE",
        },
      })

      // Update request status
      await prisma.internshipRequest.update({
        where: { id: requestId },
        data: { status: "MENTOR_ASSIGNED" },
      })

      // Send notification to mentor
      await sendNotification({
        userId: selectedMentor.id,
        type: "EMAIL",
        subject: `New Mentorship Assignment - ${request.requestNumber}`,
        message: `You have been assigned as a mentor for ${request.traineeName}.`,
        templateType: "MENTOR_ASSIGNED",
        templateData: {
          requestNumber: request.requestNumber,
          traineeName: request.traineeName,
          mentorName: `${selectedMentor.firstName} ${selectedMentor.lastName}`,
        },
      })

      return { success: true, mentorId: selectedMentor.id }
    } catch (error) {
      console.error("Error assigning mentor:", error)
      throw error
    }
  }

  static async approveRequest(requestId: number, approverId: number, comments?: string) {
    try {
      // Update approval record
      await prisma.approval.updateMany({
        where: {
          internshipRequestId: requestId,
          approverId: approverId,
          status: "PENDING",
        },
        data: {
          status: "APPROVED",
          comments,
          approvedAt: new Date(),
        },
      })

      // Check if all required approvals are complete
      const pendingApprovals = await prisma.approval.count({
        where: {
          internshipRequestId: requestId,
          status: "PENDING",
        },
      })

      if (pendingApprovals === 0) {
        // All approvals complete - update request status
        await prisma.internshipRequest.update({
          where: { id: requestId },
          data: { status: "APPROVED" },
        })

        // Auto-assign mentor if not already assigned
        const existingAssignment = await prisma.mentorAssignment.findFirst({
          where: { internshipRequestId: requestId },
        })

        if (!existingAssignment) {
          await this.assignMentor(requestId)
        }

        // Send approval notification
        const request = await prisma.internshipRequest.findUnique({
          where: { id: requestId },
          include: { submitter: true },
        })

        if (request) {
          await sendNotification({
            userId: request.requestedBy,
            type: "EMAIL",
            subject: `Internship Request Approved - ${request.requestNumber}`,
            message: `Your internship request has been approved!`,
            templateType: "REQUEST_APPROVED",
            templateData: request,
          })
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error approving request:", error)
      throw error
    }
  }
}
