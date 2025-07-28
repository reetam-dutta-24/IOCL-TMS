async function testBasicAPI() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🔍 Testing basic API...');
    
    // Test GET
    const getResponse = await fetch('http://localhost:3000/api/test-basic');
    console.log('📊 GET Response status:', getResponse.status);
    const getResult = await getResponse.json();
    console.log('✅ GET Response:', getResult);
    
    // Test POST
    const postResponse = await fetch('http://localhost:3000/api/test-basic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: "data" })
    });
    
    console.log('📊 POST Response status:', postResponse.status);
    const postResult = await postResponse.json();
    console.log('✅ POST Response:', postResult);
    
  } catch (error) {
    console.error('💥 Error testing basic API:', error);
  }
}

testBasicAPI(); 