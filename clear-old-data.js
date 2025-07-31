const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function clearOldData() {
  try {
    console.log('🧹 Clearing old forwarded student details data...')
    
    const dbPath = path.join(__dirname, 'prisma', 'dev.db')
    console.log(`📁 Database path: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message)
        return
      }
      console.log('✅ Database opened successfully')
    })
    
    // Clear all forwarded student details
    db.run("DELETE FROM forwarded_student_details", (err) => {
      if (err) {
        console.error('❌ Error clearing forwarded_student_details:', err.message)
      } else {
        console.log('✅ Cleared all forwarded student details')
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
    console.error('❌ Error in clear old data:', error)
  }
}

clearOldData() 