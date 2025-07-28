// create-test-forwarded-data.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestForwardedData() {
  try {
    console.log('🔍 Creating test forwarded student data...')
    
    // Find L&D Coordinator
    const coordinator = await prisma.user.findFirst({
      where: {
        role: {
          name: 'L&D Coordinator'
        }
      }
    })
    
    // Find L&D HoD
    const lndHod = await prisma.user.findFirst({
      where: {
        role: {
          name: 'L&D HoD'
        }
      }
    })
    
    if (!coordinator || !lndHod) {
      console.log('❌ Could not find coordinator or LND HOD users')
      return
    }
    
    console.log(`👤 Coordinator: ${coordinator.firstName} ${coordinator.lastName}`)
    console.log(`👤 LND HOD: ${lndHod.firstName} ${lndHod.lastName}`)
    
    // Create test notification
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Test - Approved Student Details for Review",
        message: "3 approved student(s) details forwarded from L&D Coordinator for IT department - awaiting LND HoD review",
        userId: lndHod.id,
        priority: "HIGH"
      }
    })
    
    // Create test applications
    const testApplications = [
      {
        id: 1,
        firstName: "Rahul",
        lastName: "Sharma",
        email: "rahul.sharma@example.com",
        institutionName: "IIT Delhi",
        courseName: "Computer Science",
        internshipDuration: 6,
        skills: "Java, Python, React",
        projectInterests: "Machine Learning, Web Development"
      },
      {
        id: 2,
        firstName: "Priya",
        lastName: "Patel",
        email: "priya.patel@example.com",
        institutionName: "NIT Surat",
        courseName: "Information Technology",
        internshipDuration: 8,
        skills: "JavaScript, Node.js, MongoDB",
        projectInterests: "Full Stack Development, API Design"
      },
      {
        id: 3,
        firstName: "Amit",
        lastName: "Kumar",
        email: "amit.kumar@example.com",
        institutionName: "BITS Pilani",
        courseName: "Software Engineering",
        internshipDuration: 12,
        skills: "C++, Data Structures, Algorithms",
        projectInterests: "System Design, Backend Development"
      }
    ]
    
    // Create forwarded details
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department: "Information Technology",
        applicationsCount: 3,
        applications: JSON.stringify(testApplications),
        forwardedBy: coordinator.id,
        forwardedTo: lndHod.id,
        status: "PENDING_LND_REVIEW"
      }
    })
    
    console.log('✅ Created test forwarded student details')
    console.log(`📋 ID: ${forwardedDetails.id}`)
    console.log(`📋 Department: ${forwardedDetails.department}`)
    console.log(`📋 Status: ${forwardedDetails.status}`)
    console.log(`📋 Applications: ${forwardedDetails.applicationsCount}`)
    
    // Create another test with different status
    const notification2 = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Test - Approved Student Details for Review",
        message: "2 approved student(s) details forwarded from L&D Coordinator for Computer Science department - awaiting LND HoD review",
        userId: lndHod.id,
        priority: "HIGH"
      }
    })
    
    const testApplications2 = [
      {
        id: 4,
        firstName: "Sneha",
        lastName: "Reddy",
        email: "sneha.reddy@example.com",
        institutionName: "IIIT Hyderabad",
        courseName: "Computer Science",
        internshipDuration: 6,
        skills: "Python, Django, PostgreSQL",
        projectInterests: "Backend Development, Database Design"
      },
      {
        id: 5,
        firstName: "Vikram",
        lastName: "Singh",
        email: "vikram.singh@example.com",
        institutionName: "NIT Trichy",
        courseName: "Computer Science",
        internshipDuration: 8,
        skills: "React, TypeScript, GraphQL",
        projectInterests: "Frontend Development, UI/UX"
      }
    ]
    
    const forwardedDetails2 = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification2.id,
        department: "Computer Science",
        applicationsCount: 2,
        applications: JSON.stringify(testApplications2),
        forwardedBy: coordinator.id,
        forwardedTo: lndHod.id,
        status: "PENDING_LND_REVIEW"
      }
    })
    
    console.log('✅ Created second test forwarded student details')
    console.log(`📋 ID: ${forwardedDetails2.id}`)
    console.log(`📋 Department: ${forwardedDetails2.department}`)
    console.log(`📋 Status: ${forwardedDetails2.status}`)
    console.log(`📋 Applications: ${forwardedDetails2.applicationsCount}`)
    
  } catch (error) {
    console.error('❌ Error creating test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestForwardedData() 