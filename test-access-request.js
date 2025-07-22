// Test script to create a sample access request
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestRequest() {
  try {
    console.log('Creating test access request...')
    
    const testRequest = await prisma.accessRequest.create({
      data: {
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        phone: "+91-9876543210",
        employeeId: "TEST001",
        requestedRoleId: 1, // L&D Coordinator
        departmentId: 2, // IT Department
        institutionName: "Test University",
        purpose: "Testing the admin panel access request functionality",
        status: 'PENDING'
      },
      include: {
        requestedRole: true,
        department: true
      }
    })
    
    console.log('Test access request created:', testRequest)
    console.log('You can now view this in the admin panel!')
    
  } catch (error) {
    console.error('Error creating test request:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestRequest()