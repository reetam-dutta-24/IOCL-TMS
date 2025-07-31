const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function checkInternshipData() {
  try {
    console.log('🔍 Checking internship data...')
    
    const dbPath = path.join(__dirname, 'prisma', 'dev.db')
    console.log(`📁 Database path: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message)
        return
      }
      console.log('✅ Database opened successfully')
    })
    
    // Check internship_requests table
    db.all("SELECT COUNT(*) as count FROM internship_requests", (err, rows) => {
      if (err) {
        console.error('❌ Error querying internship_requests:', err.message)
      } else {
        const count = rows[0]?.count || 0
        console.log(`📊 internship_requests count: ${count}`)
        
        if (count > 0) {
          db.all("SELECT * FROM internship_requests LIMIT 3", (err, records) => {
            if (err) {
              console.error('❌ Error getting internship_requests records:', err.message)
            } else {
              console.log(`📋 Sample internship_requests records:`)
              records.forEach((record, index) => {
                console.log(`  Record ${index + 1}:`)
                console.log(`    ID: ${record.id}`)
                console.log(`    Status: ${record.status}`)
                console.log(`    TraineeName: ${record.traineeName}`)
                console.log(`    Department: ${record.preferredDepartment}`)
              })
            }
          })
        }
      }
    })
    
    // Check if internship_applications table exists
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='internship_applications'", (err, tables) => {
      if (err) {
        console.error('❌ Error checking for internship_applications table:', err.message)
      } else {
        if (tables.length > 0) {
          console.log('✅ internship_applications table exists')
          
          db.all("SELECT COUNT(*) as count FROM internship_applications", (err, rows) => {
            if (err) {
              console.error('❌ Error querying internship_applications:', err.message)
            } else {
              const count = rows[0]?.count || 0
              console.log(`📊 internship_applications count: ${count}`)
              
              if (count > 0) {
                db.all("SELECT * FROM internship_applications LIMIT 3", (err, records) => {
                  if (err) {
                    console.error('❌ Error getting internship_applications records:', err.message)
                  } else {
                    console.log(`📋 Sample internship_applications records:`)
                    records.forEach((record, index) => {
                      console.log(`  Record ${index + 1}:`)
                      console.log(`    ID: ${record.id}`)
                      console.log(`    Status: ${record.status}`)
                      console.log(`    FirstName: ${record.firstName}`)
                      console.log(`    LastName: ${record.lastName}`)
                      console.log(`    Email: ${record.email}`)
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
              } else {
                // Close database if no records
                db.close((err) => {
                  if (err) {
                    console.error('❌ Error closing database:', err.message)
                  } else {
                    console.log('✅ Database closed successfully')
                  }
                })
              }
            }
          })
        } else {
          console.log('❌ internship_applications table does not exist')
          
          // Close database
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err.message)
            } else {
              console.log('✅ Database closed successfully')
            }
          })
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Error in internship data check:', error)
  }
}

checkInternshipData() 