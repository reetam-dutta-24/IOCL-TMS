const fetch = require('node-fetch');

async function testSendRequest() {
  console.log('🧪 Testing Send Request functionality...\n');

  try {
    // Test 1: Fetch approved trainees
    console.log('1. Testing fetch approved trainees...');
    const traineesResponse = await fetch('http://localhost:3000/api/internships?status=approved');
    if (traineesResponse.ok) {
      const trainees = await traineesResponse.json();
      console.log(`✅ Found ${trainees.length} approved trainees`);
    } else {
      console.log('❌ Failed to fetch approved trainees');
    }

    // Test 2: Fetch departments
    console.log('\n2. Testing fetch departments...');
    const departmentsResponse = await fetch('http://localhost:3000/api/department');
    if (departmentsResponse.ok) {
      const departments = await departmentsResponse.json();
      console.log(`✅ Found ${departments.length} departments`);
    } else {
      console.log('❌ Failed to fetch departments');
    }

    // Test 3: Test forwarding to LND HOD
    console.log('\n3. Testing forward to LND HOD...');
    const forwardResponse = await fetch('http://localhost:3000/api/notifications/forward-to-lnd-hod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department: 'Information Technology',
        applications: [
          {
            id: 1,
            firstName: 'Test',
            lastName: 'Trainee',
            email: 'test@example.com',
            phone: '+91-1234567890',
            institutionName: 'Test University',
            courseName: 'Computer Science',
            currentYear: 3,
            cgpa: 8.5,
            preferredDepartment: 'Information Technology',
            internshipDuration: 8,
            skills: 'JavaScript, React, Node.js',
            projectInterests: 'Web Development'
          }
        ]
      })
    });

    if (forwardResponse.ok) {
      const result = await forwardResponse.json();
      console.log('✅ Successfully forwarded trainee details to LND HOD');
      console.log(`   Notification ID: ${result.notificationId}`);
      console.log(`   Forwarded Details ID: ${result.forwardedDetailsId}`);
    } else {
      const error = await forwardResponse.text();
      console.log('❌ Failed to forward to LND HOD:', error);
    }

    console.log('\n🎉 Send Request functionality test completed!');

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testSendRequest(); 