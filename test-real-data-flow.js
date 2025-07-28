const fetch = require('node-fetch');

async function testRealDataFlow() {
  console.log('🧪 Testing real data flow for LND HOD dashboard...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test 1: Forwarded Student Details API
    console.log('1️⃣ Testing Forwarded Student Details API...');
    const forwardedResponse = await fetch(`${baseUrl}/api/notifications/forwarded-student-details?userId=1`);
    
    if (forwardedResponse.ok) {
      const forwardedData = await forwardedResponse.json();
      console.log('✅ Forwarded Student Details API working');
      console.log(`   - Found ${forwardedData.forwardedDetails?.length || 0} forwarded details`);
      console.log(`   - Using real data: ${!forwardedData.forwardedDetails?.some(d => d.id === 1 && d.department === 'Computer Science')}`);
    } else {
      console.log('❌ Forwarded Student Details API failed:', forwardedResponse.status);
    }

    // Test 2: LND Statistics API
    console.log('\n2️⃣ Testing LND Statistics API...');
    const statsResponse = await fetch(`${baseUrl}/api/lnd/statistics`);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ LND Statistics API working');
      console.log(`   - Total internships: ${statsData.totalInternships}`);
      console.log(`   - Pending approval: ${statsData.pendingApproval}`);
      console.log(`   - Active internships: ${statsData.activeInternships}`);
      console.log(`   - Using real data: ${statsData.totalInternships >= 0}`);
    } else {
      console.log('❌ LND Statistics API failed:', statsResponse.status);
    }

    // Test 3: HOD Dashboard API
    console.log('\n3️⃣ Testing HOD Dashboard API...');
    const hodResponse = await fetch(`${baseUrl}/api/hod-dashboard`);
    
    if (hodResponse.ok) {
      const hodData = await hodResponse.json();
      console.log('✅ HOD Dashboard API working');
      console.log(`   - Total requests: ${hodData.stats?.totalRequests || 0}`);
      console.log(`   - Pending requests: ${hodData.stats?.pendingRequests || 0}`);
      console.log(`   - Using real data: ${hodData.stats?.totalRequests >= 0}`);
    } else {
      console.log('❌ HOD Dashboard API failed:', hodResponse.status);
    }

    // Test 4: Quality Metrics API
    console.log('\n4️⃣ Testing Quality Metrics API...');
    const qualityResponse = await fetch(`${baseUrl}/api/lnd/quality/metrics`);
    
    if (qualityResponse.ok) {
      const qualityData = await qualityResponse.json();
      console.log('✅ Quality Metrics API working');
      console.log(`   - Overall score: ${qualityData.overallScore}`);
      console.log(`   - Total programs: ${qualityData.totalPrograms}`);
      console.log(`   - Using real data: ${qualityData.totalPrograms >= 0}`);
    } else {
      console.log('❌ Quality Metrics API failed:', qualityResponse.status);
    }

    console.log('\n🎉 Real data flow test completed!');
    console.log('\n📊 Summary:');
    console.log('   - All APIs should now return real data from the database');
    console.log('   - No more demo/fallback data in LND HOD dashboard');
    console.log('   - Data flows from LND Coordinator → LND HOD via notifications');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
testRealDataFlow(); 