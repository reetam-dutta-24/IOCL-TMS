const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testForwardedDetailsAPI() {
  try {
    console.log('🧪 Testing forwarded student details API...')
    
    // Test the exact query that's failing
    const userId = 1 // L&D HoD user ID
    
    console.log(`🔍 Testing query for user ID: ${userId}`)
    
    const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: userId,
        status: {
          in: ["PENDING_LND_REVIEW", "APPROVED_BY_LND", "REJECTED_BY_LND"]
        }
      },
      include: {
        notification: true,
        forwardedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`✅ Query successful! Found ${forwardedDetails.length} records`)
    
    forwardedDetails.forEach((detail, index) => {
      console.log(`\n📋 Record ${index + 1}:`)
      console.log(`   ID: ${detail.id}`)
      console.log(`   Department: ${detail.department}`)
      console.log(`   Status: ${detail.status}`)
      console.log(`   Forwarded by: ${detail.forwardedByUser.firstName} ${detail.forwardedByUser.lastName}`)
      console.log(`   Applications count: ${detail.applicationsCount}`)
      console.log(`   Created: ${detail.createdAt}`)
    })
    
    // Test the API endpoint directly
    console.log('\n🌐 Testing API endpoint...')
    const response = await fetch('http://localhost:3000/api/notifications/forwarded-student-details?userId=1')
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API response:', data)
    } else {
      const errorData = await response.text()
      console.log('❌ API error:', response.status, errorData)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testForwardedDetailsAPI() 