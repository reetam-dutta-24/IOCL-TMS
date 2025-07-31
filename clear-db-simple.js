const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...')
    
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
      
      // Clear related notifications
      db.run("DELETE FROM notifications WHERE type = 'STUDENT_DETAILS_FORWARDED'", (err) => {
        if (err) {
          console.error('❌ Error clearing notifications:', err.message)
        } else {
          console.log('✅ Cleared related notifications')
        }
        
        // Close database
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message)
          } else {
            console.log('✅ Database cleared and closed successfully')
          }
        })
      })
    })
    
  } catch (error) {
    console.error('❌ Error in clear database:', error)
  }
}

clearDatabase() 