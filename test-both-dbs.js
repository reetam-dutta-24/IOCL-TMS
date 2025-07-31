const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function testBothDatabases() {
  const dbPaths = [
    path.join(__dirname, 'prisma', 'dev.db'),
    path.join(__dirname, 'prisma', 'prisma', 'dev.db')
  ]
  
  for (let i = 0; i < dbPaths.length; i++) {
    const dbPath = dbPaths[i]
    console.log(`\n🔍 Testing database ${i + 1}: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`❌ Error opening database ${i + 1}:`, err.message)
        return
      }
      console.log(`✅ Database ${i + 1} opened successfully`)
    })
    
    // Test forwarded_student_details table
    db.all("SELECT COUNT(*) as count FROM forwarded_student_details", (err, rows) => {
      if (err) {
        console.error(`❌ Error querying forwarded_student_details in database ${i + 1}:`, err.message)
      } else {
        const count = rows[0]?.count || 0
        console.log(`📊 Database ${i + 1} - forwarded_student_details count: ${count}`)
        
        if (count > 0) {
          // Get sample records
          db.all("SELECT * FROM forwarded_student_details LIMIT 2", (err, records) => {
            if (err) {
              console.error(`❌ Error getting sample records from database ${i + 1}:`, err.message)
            } else {
              console.log(`📋 Sample records from database ${i + 1}:`)
              records.forEach((record, index) => {
                console.log(`  Record ${index + 1}:`)
                console.log(`    ID: ${record.id}`)
                console.log(`    Department: ${record.department}`)
                console.log(`    Status: ${record.status}`)
                console.log(`    ForwardedTo: ${record.forwardedTo}`)
              })
            }
            
            // Close database
            db.close((err) => {
              if (err) {
                console.error(`❌ Error closing database ${i + 1}:`, err.message)
              } else {
                console.log(`✅ Database ${i + 1} closed successfully`)
              }
            })
          })
        } else {
          // Close database if no records
          db.close((err) => {
            if (err) {
              console.error(`❌ Error closing database ${i + 1}:`, err.message)
            } else {
              console.log(`✅ Database ${i + 1} closed successfully`)
            }
          })
        }
      }
    })
  }
}

testBothDatabases() 