const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function checkForwardedData() {
  try {
    console.log('🔍 Checking forwarded student details data...')
    
    const dbPath = path.join(__dirname, 'prisma', 'dev.db')
    console.log(`📁 Database path: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message)
        return
      }
      console.log('✅ Database opened successfully')
    })
    
    // Check all forwarded student details
    db.all("SELECT * FROM forwarded_student_details ORDER BY createdAt DESC", (err, records) => {
      if (err) {
        console.error('❌ Error querying forwarded_student_details:', err.message)
      } else {
        console.log(`📊 Found ${records.length} forwarded student details records:`)
        records.forEach((record, index) => {
          console.log(`\n📋 Record ${index + 1}:`)
          console.log(`  ID: ${record.id}`)
          console.log(`  Department: ${record.department}`)
          console.log(`  Status: ${record.status}`)
          console.log(`  ForwardedTo: ${record.forwardedTo}`)
          console.log(`  ForwardedBy: ${record.forwardedBy}`)
          console.log(`  ApplicationsCount: ${record.applicationsCount}`)
          console.log(`  CreatedAt: ${record.createdAt}`)
          console.log(`  UpdatedAt: ${record.updatedAt}`)
          
          // Parse and show applications data
          try {
            const applications = JSON.parse(record.applications)
            console.log(`  Applications (${applications.length}):`)
            applications.forEach((app, appIndex) => {
              console.log(`    App ${appIndex + 1}: ${app.firstName} ${app.lastName} (${app.email})`)
            })
          } catch (parseError) {
            console.log(`  ❌ Error parsing applications: ${parseError.message}`)
          }
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
    console.error('❌ Error in forwarded data check:', error)
  }
}

checkForwardedData() 