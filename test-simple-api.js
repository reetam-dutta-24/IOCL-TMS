const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSimpleAPI() {
  try {
    console.log('🧪 Testing simple API endpoint...')
    
    // Use dynamic import for fetch
    const { default: fetch } = await import('node-fetch')
    
    const response = await fetch('http://localhost:3000/api/test-forwarded-simple')
    
    console.log(`Status: ${response.status}`)
    
    const text = await response.text()
    console.log('Response body:', text)
    
    if (response.ok) {
      try {
        const json = JSON.parse(text)
        console.log('✅ JSON response:', json)
      } catch (e) {
        console.log('❌ Not valid JSON')
      }
    } else {
      console.log('❌ API returned error status')
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

testSimpleAPI() 