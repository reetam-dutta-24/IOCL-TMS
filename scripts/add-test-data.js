const { PrismaClient } = require('@prisma/client')

// Set the database URL for SQLite
process.env.DATABASE_URL = "file:./prisma/dev.db"

const prisma = new PrismaClient()

async function addTestData() {
  try {
    console.log('🧪 Adding test internship applications...')
    
    // Add some test internship applications
    const testApplications = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '1234567890',
        institutionName: 'Test University',
        courseName: 'Computer Science',
        currentYear: 3,
        cgpa: 3.8,
        preferredDepartment: 'Information Technology',
        internshipDuration: 12,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        skills: 'JavaScript, React, Node.js',
        projectInterests: 'Web Development, AI/ML',
        motivation: 'Interested in gaining practical experience',
        status: 'APPROVED',
        applicationNumber: 'INT-2024-001'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        phone: '0987654321',
        institutionName: 'Test College',
        courseName: 'Engineering',
        currentYear: 4,
        cgpa: 3.9,
        preferredDepartment: 'Engineering',
        internshipDuration: 8,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-08-31'),
        skills: 'Python, CAD, MATLAB',
        projectInterests: 'Mechanical Design, Automation',
        motivation: 'Want to apply theoretical knowledge',
        status: 'PENDING',
        applicationNumber: 'INT-2024-002'
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@test.com',
        phone: '5555555555',
        institutionName: 'Test Institute',
        courseName: 'Business Administration',
        currentYear: 2,
        cgpa: 3.7,
        preferredDepartment: 'Operations',
        internshipDuration: 6,
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-08-15'),
        skills: 'Excel, PowerPoint, Project Management',
        projectInterests: 'Process Optimization, Data Analysis',
        motivation: 'Looking for corporate experience',
        status: 'APPROVED',
        applicationNumber: 'INT-2024-003'
      }
    ]
    
    for (const app of testApplications) {
      const existing = await prisma.internshipApplication.findFirst({
        where: { email: app.email }
      })
      
      if (!existing) {
        await prisma.internshipApplication.create({
          data: app
        })
        console.log(`✅ Added application for ${app.firstName} ${app.lastName}`)
      } else {
        console.log(`⏭️ Application for ${app.firstName} ${app.lastName} already exists`)
      }
    }
    
    console.log('✅ Test data added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestData() 