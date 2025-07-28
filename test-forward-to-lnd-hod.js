const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testForwardToLndHod() {
  try {
    console.log('🧪 Testing Forward to LND HoD functionality...\n');

    // 1. Check if L&D Coordinator exists
    console.log('1. Checking for L&D Coordinator...');
    const coordinator = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D Coordinator"
        },
        isActive: true
      }
    });

    if (!coordinator) {
      console.log('❌ No L&D Coordinator found. Creating one...');
      const coordinatorRole = await prisma.role.findFirst({
        where: { name: "L&D Coordinator" }
      });
      
      if (!coordinatorRole) {
        console.log('❌ L&D Coordinator role not found');
        return;
      }

      const newCoordinator = await prisma.user.create({
        data: {
          employeeId: "COORD001",
          firstName: "Test",
          lastName: "Coordinator",
          email: "coordinator@test.com",
          password: "hashedpassword",
          roleId: coordinatorRole.id,
          isActive: true
        }
      });
      console.log('✅ Created L&D Coordinator:', newCoordinator.employeeId);
    } else {
      console.log('✅ L&D Coordinator found:', coordinator.employeeId);
    }

    // 2. Check if L&D HoD exists
    console.log('\n2. Checking for L&D HoD...');
    const lndHod = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D HoD"
        },
        isActive: true
      }
    });

    if (!lndHod) {
      console.log('❌ No L&D HoD found. Creating one...');
      const hodRole = await prisma.role.findFirst({
        where: { name: "L&D HoD" }
      });
      
      if (!hodRole) {
        console.log('❌ L&D HoD role not found');
        return;
      }

      const newHod = await prisma.user.create({
        data: {
          employeeId: "LNDHOD001",
          firstName: "Test",
          lastName: "LND HoD",
          email: "lndhod@test.com",
          password: "hashedpassword",
          roleId: hodRole.id,
          isActive: true
        }
      });
      console.log('✅ Created L&D HoD:', newHod.employeeId);
    } else {
      console.log('✅ L&D HoD found:', lndHod.employeeId);
    }

    // 3. Check for internship applications
    console.log('\n3. Checking for internship applications...');
    const applications = await prisma.internshipApplication.findMany({
      take: 5
    });

    console.log(`📊 Found ${applications.length} internship applications`);
    if (applications.length > 0) {
      console.log('Sample applications:');
      applications.slice(0, 3).forEach(app => {
        console.log(`  - ${app.firstName} ${app.lastName} (${app.preferredDepartment}) - ${app.status}`);
      });
    }

    // 4. Test the forward API endpoint
    console.log('\n4. Testing forward API endpoint...');
    
    const testApplications = applications.slice(0, 2).map(app => ({
      id: app.id,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      institutionName: app.institutionName,
      courseName: app.courseName,
      preferredDepartment: app.preferredDepartment,
      internshipDuration: app.internshipDuration,
      status: app.status
    }));

    if (testApplications.length === 0) {
      console.log('⚠️ No applications to test with. Creating test application...');
      const testApp = await prisma.internshipApplication.create({
        data: {
          applicationNumber: "TEST001",
          firstName: "Test",
          lastName: "Student",
          email: "test.student@test.com",
          phone: "1234567890",
          institutionName: "Test University",
          courseName: "Computer Science",
          currentYear: 3,
          cgpa: 8.5,
          preferredDepartment: "Computer Science",
          internshipDuration: 8,
          startDate: new Date(),
          endDate: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000),
          motivation: "Test motivation",
          status: "APPROVED"
        }
      });
      testApplications.push({
        id: testApp.id,
        firstName: testApp.firstName,
        lastName: testApp.lastName,
        email: testApp.email,
        institutionName: testApp.institutionName,
        courseName: testApp.courseName,
        preferredDepartment: testApp.preferredDepartment,
        internshipDuration: testApp.internshipDuration,
        status: testApp.status
      });
      console.log('✅ Created test application');
    }

    // 5. Test the API call
    console.log('\n5. Making API call to forward applications...');
    
    const response = await fetch('http://localhost:3000/api/notifications/forward-to-lnd-hod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department: testApplications[0]?.preferredDepartment || "Computer Science",
        applications: testApplications
      })
    });

    console.log(`📤 API Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API call successful!');
      console.log('📋 Response:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ API call failed:', errorText);
    }

    // 6. Check if forwarded details were created
    console.log('\n6. Checking forwarded details in database...');
    const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        notification: true,
        forwardedByUser: true,
        forwardedToUser: true
      }
    });

    console.log(`📊 Found ${forwardedDetails.length} forwarded details`);
    forwardedDetails.forEach(detail => {
      console.log(`  - ID: ${detail.id}, Department: ${detail.department}, Status: ${detail.status}`);
      console.log(`    Forwarded by: ${detail.forwardedByUser?.firstName} ${detail.forwardedByUser?.lastName}`);
      console.log(`    Forwarded to: ${detail.forwardedToUser?.firstName} ${detail.forwardedToUser?.lastName}`);
    });

    // 7. Test the forwarded details API
    console.log('\n7. Testing forwarded details API...');
    const hodUser = await prisma.user.findFirst({
      where: {
        role: { name: "L&D HoD" },
        isActive: true
      }
    });

    if (hodUser) {
      const detailsResponse = await fetch(`http://localhost:3000/api/notifications/forwarded-student-details?userId=${hodUser.id}`);
      console.log(`📤 Details API Response Status: ${detailsResponse.status}`);
      
      if (detailsResponse.ok) {
        const detailsResult = await detailsResponse.json();
        console.log('✅ Details API call successful!');
        console.log(`📋 Found ${detailsResult.forwardedDetails?.length || 0} forwarded details for LND HoD`);
      } else {
        const errorText = await detailsResponse.text();
        console.log('❌ Details API call failed:', errorText);
      }
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testForwardToLndHod(); 