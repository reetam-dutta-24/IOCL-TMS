const fetch = require('node-fetch');

async function testLogin(employeeId, password) {
  try {
    console.log(`\n🧪 Testing login for: ${employeeId}`);
    
    const response = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        password,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Login successful for ${employeeId}`);
      console.log(`   User: ${data.user.name}`);
      console.log(`   Role: ${data.user.role}`);
      console.log(`   Department: ${data.user.department}`);
    } else {
      console.log(`❌ Login failed for ${employeeId}`);
      console.log(`   Error: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Network error for ${employeeId}: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting login tests...\n');
  
  // Test with seeded users from the seed file
  const testUsers = [
    { employeeId: 'EMP001', password: 'demo123', role: 'L&D HoD' },
    { employeeId: 'EMP002', password: 'demo123', role: 'L&D Coordinator' },
    { employeeId: 'EMP003', password: 'demo123', role: 'Department HoD' },
    { employeeId: 'EMP004', password: 'demo123', role: 'Mentor' },
    { employeeId: 'EMP005', password: 'demo123', role: 'Mentor' },
    { employeeId: 'EMP006', password: 'demo123', role: 'Department HoD' },
    { employeeId: 'EMP007', password: 'demo123', role: 'Department HoD' },
    { employeeId: 'EMP010', password: 'demo123', role: 'Trainee' },
    { employeeId: 'ADMIN001', password: 'admin123', role: 'Admin' },
  ];

  for (const user of testUsers) {
    await testLogin(user.employeeId, user.password);
  }
  
  console.log('\n🏁 Login tests completed!');
}

runTests(); 