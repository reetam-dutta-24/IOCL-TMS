const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Checking users and their roles...')
    
    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    })
    
    console.log('📋 All users:')
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.firstName} ${user.lastName}, Role: ${user.role.name}, Email: ${user.email}`)
    })
    
    // Find LND HOD specifically
    const lndHod = await prisma.user.findFirst({
      where: {
        role: {
          name: 'L&D HoD'
        }
      },
      include: {
        role: true
      }
    })
    
    if (lndHod) {
      console.log(`\n🎯 L&D HoD found:`)
      console.log(`  - ID: ${lndHod.id}`)
      console.log(`  - Name: ${lndHod.firstName} ${lndHod.lastName}`)
      console.log(`  - Role: ${lndHod.role.name}`)
      console.log(`  - Email: ${lndHod.email}`)
    } else {
      console.log('\n❌ No L&D HoD found')
    }
    
    // Check forwarded details for different user IDs
    console.log('\n🔍 Checking forwarded details for different users:')
    for (let userId = 1; userId <= 5; userId++) {
      try {
        const details = await prisma.forwardedStudentDetails.findMany({
          where: {
            forwardedTo: userId
          }
        })
        console.log(`  - User ID ${userId}: ${details.length} forwarded details`)
      } catch (error) {
        console.log(`  - User ID ${userId}: Error - ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers() 