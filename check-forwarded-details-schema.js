const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAndFixForwardedDetails() {
  try {
    console.log('🔍 Checking forwarded_student_details table structure...')
    
    // First, let's check if the table exists and what columns it has
    const tableInfo = await prisma.$queryRaw`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='forwarded_student_details'
    `
    console.log('Table structure:', tableInfo)
    
    // Check if there's any data in the table
    const count = await prisma.forwardedStudentDetails.count()
    console.log(`📊 Current records in forwarded_student_details: ${count}`)
    
    if (count === 0) {
      console.log('📝 No data found. Creating test forwarded student details...')
      
      // First, let's get some users to work with
      const users = await prisma.user.findMany({
        where: {
          role: {
            name: {
              in: ['L&D Coordinator', 'L&D HoD']
            }
          }
        },
        include: {
          role: true
        }
      })
      
      console.log(`Found ${users.length} users with coordinator/HoD roles`)
      
      if (users.length >= 2) {
        const coordinator = users.find(u => u.role.name === 'L&D Coordinator')
        const hod = users.find(u => u.role.name === 'L&D HoD')
        
        if (coordinator && hod) {
          // Create a test notification first
          const notification = await prisma.notification.create({
            data: {
              userId: hod.id,
              type: 'FORWARDED_STUDENT_DETAILS',
              title: 'Student Details Forwarded',
              message: 'New student applications have been forwarded for your review',
              priority: 'HIGH',
              status: 'UNREAD'
            }
          })
          
          // Create test forwarded student details
          const testData = await prisma.forwardedStudentDetails.create({
            data: {
              notificationId: notification.id,
              department: 'Information Technology',
              applicationsCount: 3,
              applications: JSON.stringify([
                {
                  id: 1,
                  firstName: 'Arjun',
                  lastName: 'Sharma',
                  email: 'arjun.sharma@student.edu',
                  institutionName: 'IIT Delhi',
                  courseName: 'Computer Science',
                  preferredDepartment: 'Information Technology'
                },
                {
                  id: 2,
                  firstName: 'Priya',
                  lastName: 'Patel',
                  email: 'priya.patel@student.edu',
                  institutionName: 'NIT Trichy',
                  courseName: 'Information Technology',
                  preferredDepartment: 'Information Technology'
                },
                {
                  id: 3,
                  firstName: 'Rahul',
                  lastName: 'Kumar',
                  email: 'rahul.kumar@student.edu',
                  institutionName: 'BITS Pilani',
                  courseName: 'Computer Science',
                  preferredDepartment: 'Information Technology'
                }
              ]),
              forwardedBy: coordinator.id,
              forwardedTo: hod.id,
              status: 'PENDING_LND_REVIEW'
            }
          })
          
          console.log('✅ Created test forwarded student details:', testData)
        }
      }
    } else {
      // Check existing data
      const existingData = await prisma.forwardedStudentDetails.findMany({
        include: {
          notification: true,
          forwardedByUser: true,
          forwardedToUser: true
        }
      })
      
      console.log('📋 Existing forwarded details:')
      existingData.forEach((detail, index) => {
        console.log(`${index + 1}. ID: ${detail.id}`)
        console.log(`   Department: ${detail.department}`)
        console.log(`   Status: ${detail.status}`)
        console.log(`   Forwarded by: ${detail.forwardedByUser.firstName} ${detail.forwardedByUser.lastName}`)
        console.log(`   Forwarded to: ${detail.forwardedToUser.firstName} ${detail.forwardedToUser.lastName}`)
        console.log(`   Created: ${detail.createdAt}`)
        console.log('---')
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndFixForwardedDetails() 