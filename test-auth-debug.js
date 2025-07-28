const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function authenticateUser(employeeId, password) {
  try {
    console.log(`🔍 Authentication attempt for Employee ID: ${employeeId}`);
    
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    });

    if (!user) {
      console.log(`❌ User not found for Employee ID: ${employeeId}`);
      return null;
    }

    if (!user.password) {
      console.log(`❌ User ${employeeId} has no password set`);
      return null;
    }

    console.log(`✅ User found: ${user.firstName} ${user.lastName} (${user.employeeId})`);
    console.log(`✅ User active: ${user.isActive}`);
    console.log(`✅ Password hash exists: ${!!user.password}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`🔑 Password validation result: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for user: ${employeeId}`);
      return null;
    }

    if (!user.isActive) {
      console.log(`❌ User ${employeeId} is not active`);
      return null;
    }

    // Return user data with safe string handling
    return {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      department: user.department?.name || 'Unknown',
      isActive: user.isActive
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

async function testAuth() {
  try {
    console.log('🧪 Testing authentication function...\n');
    
    const result = await authenticateUser('EMP001', 'demo123');
    
    if (result) {
      console.log('\n✅ Authentication successful!');
      console.log('User data:', result);
    } else {
      console.log('\n❌ Authentication failed!');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth(); 