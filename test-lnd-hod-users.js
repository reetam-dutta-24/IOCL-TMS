const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLndHodUsers() {
  try {
    console.log('🔍 Checking for L&D HoD users...');
    
    // Check all users with their roles
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      }
    });
    
    console.log(`✅ Found ${users.length} total users`);
    
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id})`);
      console.log(`  Role: ${user.role.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Department: ${user.department?.name || 'None'}`);
      console.log('');
    });
    
    // Check specifically for L&D HoD users
    const lndHodUsers = await prisma.user.findMany({
      where: {
        role: {
          name: "L&D HoD"
        }
      },
      include: {
        role: true,
        department: true
      }
    });
    
    console.log(`\n🎯 L&D HoD users: ${lndHodUsers.length}`);
    lndHodUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id})`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Department: ${user.department?.name || 'None'}`);
    });
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLndHodUsers(); 