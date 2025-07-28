const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRoles() {
  try {
    const roles = await prisma.role.findMany();
    console.log('Available roles:');
    roles.forEach(role => {
      console.log(`  ${role.id}: ${role.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoles(); 