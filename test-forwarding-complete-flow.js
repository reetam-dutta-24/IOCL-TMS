async function testCompleteForwardingFlow() {
  console.log('🧪 Testing Complete Forwarding Flow...\n');

  // Dynamic import for node-fetch
  const fetch = (await import('node-fetch')).default;
  const baseUrl = 'http://localhost:3002'; // Using port 3002 as shown in your terminal

  try {
    // Step 1: Test the forward-to-lnd-hod API directly
    console.log('1️⃣ Testing Forward to LND HoD API...');
    const testData = {
      department: "Information Technology",
      applications: [
        {
          id: 1,
          firstName: "Test",
          lastName: "Student",
          email: "test.student@example.com",
          institutionName: "Test University",
          courseName: "B.Tech Computer Science",
          internshipDuration: 6,
          skills: "JavaScript, React, Node.js",
          projectInterests: "Web Development",
          status: "APPROVED"
        }
      ]
    };

    console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));

    const forwardResponse = await fetch(`${baseUrl}/api/notifications/forward-to-lnd-hod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log(`📤 Response status: ${forwardResponse.status}`);
    console.log(`📤 Response ok: ${forwardResponse.ok}`);

    if (!forwardResponse.ok) {
      const errorText = await forwardResponse.text();
      console.error(`❌ Error response: ${errorText}`);
      return;
    }

    const forwardResult = await forwardResponse.json();
    console.log('✅ Forward API response:', JSON.stringify(forwardResult, null, 2));

    // Step 2: Test fetching forwarded student details
    console.log('\n2️⃣ Testing Forwarded Student Details API...');
    const detailsResponse = await fetch(`${baseUrl}/api/notifications/forwarded-student-details?userId=1`);
    
    console.log(`📤 Details response status: ${detailsResponse.status}`);
    console.log(`📤 Details response ok: ${detailsResponse.ok}`);

    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error(`❌ Details error response: ${errorText}`);
      return;
    }

    const detailsResult = await detailsResponse.json();
    console.log('✅ Details API response:', JSON.stringify(detailsResult, null, 2));

    // Step 3: Test the HOD dashboard API
    console.log('\n3️⃣ Testing HOD Dashboard API...');
    const dashboardResponse = await fetch(`${baseUrl}/api/hod-dashboard`);
    
    console.log(`📤 Dashboard response status: ${dashboardResponse.status}`);
    console.log(`📤 Dashboard response ok: ${dashboardResponse.ok}`);

    if (!dashboardResponse.ok) {
      const errorText = await dashboardResponse.text();
      console.error(`❌ Dashboard error response: ${errorText}`);
      return;
    }

    const dashboardResult = await dashboardResponse.json();
    console.log('✅ Dashboard API response keys:', Object.keys(dashboardResult));

    // Step 4: Test LND statistics API
    console.log('\n4️⃣ Testing LND Statistics API...');
    const statsResponse = await fetch(`${baseUrl}/api/lnd/statistics`);
    
    console.log(`📤 Stats response status: ${statsResponse.status}`);
    console.log(`📤 Stats response ok: ${statsResponse.ok}`);

    if (!statsResponse.ok) {
      const errorText = await statsResponse.text();
      console.error(`❌ Stats error response: ${errorText}`);
      return;
    }

    const statsResult = await statsResponse.json();
    console.log('✅ Stats API response keys:', Object.keys(statsResult));

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Forward to LND HoD API: Working');
    console.log('✅ Forwarded Student Details API: Working');
    console.log('✅ HOD Dashboard API: Working');
    console.log('✅ LND Statistics API: Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCompleteForwardingFlow(); 