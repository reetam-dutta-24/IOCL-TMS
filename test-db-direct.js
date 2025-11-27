const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function testDatabase() {
  try {
    console.log('🔍 Testing direct database access...')
    
    const dbPath = path.join(__dirname, 'prisma', 'dev.db')
    console.log(`📁 Database path: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message)
        return
      }
      console.log('✅ Database opened successfully')
    })
    
    // Test query
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.error('❌ Error querying tables:', err.message)
      } else {
        console.log('📋 Available tables:')
        tables.forEach(table => {
          console.log(`  - ${table.name}`)
        })
      }
    })
    
    // Test forwarded_student_details table
    db.all("SELECT * FROM forwarded_student_details LIMIT 2", (err, rows) => {
      if (err) {
        console.error('❌ Error querying forwarded_student_details:', err.message)
      } else {
        console.log(`📊 Found ${rows.length} records in forwarded_student_details:`)
        rows.forEach((row, index) => {
          console.log(`  Record ${index + 1}:`)
          console.log(`    ID: ${row.id}`)
          console.log(`    Department: ${row.department}`)
          console.log(`    Status: ${row.status}`)
          console.log(`    ForwardedTo: ${row.forwardedTo}`)
        })
      }
      
      // Close database
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message)
        } else {
          console.log('✅ Database closed successfully')
        }
      })
    })
    
  } catch (error) {
    console.error('❌ Error in database test:', error)
  }
}

testDatabase() 