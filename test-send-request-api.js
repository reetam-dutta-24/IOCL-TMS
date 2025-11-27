const fetch = require('node-fetch')

async function testSendRequestAPI() {
  try {
    console.log('🧪 Testing send request API...')
    
    // Test 1: Fetch approved trainees
    console.log('1. Testing fetch approved trainees...')
    const traineesResponse = await fetch('http://localhost:3000/api/department-hod/approved-trainees')
    
    if (traineesResponse.ok) {
      const traineesData = await traineesResponse.json()
      console.log(`✅ Found ${traineesData.approvedTrainees.length} approved trainees`)
      
      traineesData.approvedTrainees.forEach((trainee, index) => {
        console.log(`\n📋 Trainee ${index + 1}:`)
        console.log(`  ID: ${trainee.id}`)
        console.log(`  Name: ${trainee.firstName} ${trainee.lastName}`)
        console.log(`  Email: ${trainee.email}`)
        console.log(`  Institution: ${trainee.institutionName}`)
        console.log(`  Course: ${trainee.courseName}`)
        console.log(`  Department: ${trainee.preferredDepartment}`)
        console.log(`  Status: ${trainee.status}`)
      })
    } else {
      console.log('❌ Failed to fetch approved trainees')
    }
    
    // Test 2: Fetch departments
    console.log('\n2. Testing fetch departments...')
    const departmentsResponse = await fetch('http://localhost:3000/api/department')
    
    if (departmentsResponse.ok) {
      const departmentsData = await departmentsResponse.json()
      console.log(`✅ Found ${departmentsData.length} departments`)
    } else {
      console.log('❌ Failed to fetch departments')
    }
    
  } catch (error) {
    console.error('❌ Error in send request API test:', error)
  }
}

testSendRequestAPI() 