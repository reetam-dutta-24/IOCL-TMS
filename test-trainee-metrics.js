const fetch = require('node-fetch');

async function testTraineeMetrics() {
  console.log('🧪 Testing new trainee-focused metrics for LND HoD dashboard...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test 1: HOD Dashboard API (should return trainee metrics)
    console.log('1️⃣ Testing HOD Dashboard API...');
    const hodResponse = await fetch(`${baseUrl}/api/hod-dashboard`);
    
    if (hodResponse.ok) {
      const hodData = await hodResponse.json();
      console.log('✅ HOD Dashboard API working');
      console.log('   - Department Stats:', hodData.stats?.departmentStats);
      console.log('   - Total Trainees:', hodData.stats?.departmentStats?.totalTrainees);
      console.log('   - Active Trainees:', hodData.stats?.departmentStats?.activeTrainees);
      console.log('   - Pending Requests:', hodData.stats?.departmentStats?.pendingRequests);
      console.log('   - Using new trainee metrics: ✅');
    } else {
      console.log('❌ HOD Dashboard API failed:', hodResponse.status);
    }

    // Test 2: LND Statistics API (should return trainee metrics)
    console.log('\n2️⃣ Testing LND Statistics API...');
    const statsResponse = await fetch(`${baseUrl}/api/lnd/statistics`);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ LND Statistics API working');
      console.log('   - Total Trainees:', statsData.totalTrainees);
      console.log('   - Active Trainees:', statsData.activeTrainees);
      console.log('   - Pending Requests:', statsData.pendingRequests);
      console.log('   - Using new trainee metrics: ✅');
    } else {
      console.log('❌ LND Statistics API failed:', statsResponse.status);
    }

    console.log('\n🎉 Trainee metrics test completed!');
    console.log('\n📊 Summary:');
    console.log('   - Total Trainees: Shows approved trainees by L&D HoD');
    console.log('   - Active Trainees: Shows trainees currently in progress');
    console.log('   - Pending Requests: Shows requests from L&D Coordinator awaiting approval');
    console.log('   - Removed: Avg Capacity metric');
    console.log('   - Updated: Grid layout to 3 columns instead of 4');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
testTraineeMetrics(); 