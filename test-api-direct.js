const fs = require('fs');
const path = require('path');

console.log('🔍 Checking API route file...');

const apiRoutePath = path.join(__dirname, 'app', 'api', 'notifications', 'forwarded-student-details', 'route.ts');

if (fs.existsSync(apiRoutePath)) {
  console.log('✅ API route file exists:', apiRoutePath);
  
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  console.log('📄 File size:', content.length, 'characters');
  console.log('📋 First 200 characters:');
  console.log(content.substring(0, 200));
} else {
  console.log('❌ API route file not found:', apiRoutePath);
}

// Check if the route is properly structured
const routeDir = path.dirname(apiRoutePath);
console.log('📁 Route directory exists:', fs.existsSync(routeDir));

// List files in the route directory
if (fs.existsSync(routeDir)) {
  const files = fs.readdirSync(routeDir);
  console.log('📋 Files in route directory:', files);
} 