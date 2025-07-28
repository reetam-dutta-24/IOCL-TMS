const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkApprovedApplications() {
  try {
    console.log('🔍 Checking for approved internship applications...');
    
    const applications = await prisma.internshipApplication.findMany({
      where: { status: 'APPROVED' },
      include: { reviewer: true }
    });
    
    console.log(`✅ Found ${applications.length} approved applications:`);
    
    if (applications.length === 0) {
      console.log('❌ No approved applications found');
      
      // Check all applications to see what statuses exist
      const allApplications = await prisma.internshipApplication.findMany({
        select: { id: true, firstName: true, lastName: true, status: true }
      });
      
      console.log('\n📊 All applications by status:');
      const statusCounts = {};
      allApplications.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
      });
      
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      
      if (allApplications.length > 0) {
        console.log('\n📋 Sample applications:');
        allApplications.slice(0, 5).forEach(app => {
          console.log(`  - ${app.firstName} ${app.lastName} (ID: ${app.id}, Status: ${app.status})`);
        });
      }
    } else {
      applications.forEach(app => {
        console.log(`  - ${app.firstName} ${app.lastName} (ID: ${app.id}, Status: ${app.status}, Reviewed by: ${app.reviewer?.firstName || 'None'})`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error checking applications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkApprovedApplications(); 