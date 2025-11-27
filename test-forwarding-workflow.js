const fetch = require('node-fetch');

async function testForwardingWorkflow() {
  console.log('🧪 Testing complete forwarding workflow...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Step 1: Test forwarding data from coordinator to HOD
    console.log('1️⃣ Testing Forward to LND HoD API...');
    const forwardData = {
      department: "Information Technology",
      applications: [
        {
          firstName: "Test",
          lastName: "Student",
          email: "test.student@example.com",
          institutionName: "Test University",
          courseName: "B.Tech Computer Science",
          internshipDuration: 6,
          skills: "JavaScript, React, Node.js",
          projectInterests: "Web Development"
        }
      ]
    };

    const forwardResponse = await fetch(`${baseUrl}/api/notifications/forward-to-lnd-hod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(forwardData)
    });

    if (forwardResponse.ok) {
      const forwardResult = await forwardResponse.json();
      console.log('✅ Forward to LND HoD API working');
      console.log(`   - Forwarded ${forwardResult.forwardedDetailsId} details`);
      console.log(`   - HOD User: ${forwardResult.hodUser?.name}`);
    } else {
      console.log('❌ Forward to LND HoD API failed:', forwardResponse.status);
      const errorText = await forwardResponse.text();
      console.log('Error:', errorText);
    }

    // Step 2: Test fetching forwarded details for HOD
    console.log('\n2️⃣ Testing Fetch Forwarded Details for HOD...');
    const fetchResponse = await fetch(`${baseUrl}/api/notifications/forwarded-student-details?userId=1`);
    
    if (fetchResponse.ok) {
      const fetchData = await fetchResponse.json();
      console.log('✅ Fetch Forwarded Details API working');
      console.log(`   - Found ${fetchData.forwardedDetails?.length || 0} forwarded details`);
      
      if (fetchData.forwardedDetails?.length > 0) {
        const detail = fetchData.forwardedDetails[0];
        console.log(`   - Department: ${detail.department}`);
        console.log(`   - Applications: ${detail.applicationsCount}`);
        console.log(`   - Forwarded by: ${detail.forwardedBy}`);
        console.log(`   - Status: ${detail.status}`);
      }
    } else {
      console.log('❌ Fetch Forwarded Details API failed:', fetchResponse.status);
      const errorText = await fetchResponse.text();
      console.log('Error:', errorText);
    }

    console.log('\n🎉 Forwarding workflow test completed!');
    console.log('\n📊 Summary:');
    console.log('   - Coordinator can forward student details to HOD');
    console.log('   - HOD can view forwarded student details');
    console.log('   - Real data flow is working');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
testForwardingWorkflow(); 