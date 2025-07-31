const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function checkApprovedTrainee() {
  try {
    console.log('🔍 Checking approved trainee data...')
    
    const dbPath = path.join(__dirname, 'prisma', 'dev.db')
    console.log(`📁 Database path: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message)
        return
      }
      console.log('✅ Database opened successfully')
    })
    
    // Check the approved trainee
    db.all("SELECT * FROM internship_requests WHERE status = 'APPROVED'", (err, records) => {
      if (err) {
        console.error('❌ Error querying approved trainees:', err.message)
      } else {
        console.log(`📊 Found ${records.length} approved trainees:`)
        records.forEach((record, index) => {
          console.log(`\n📋 Approved Trainee ${index + 1}:`)
          console.log(`  ID: ${record.id}`)
          console.log(`  Status: ${record.status}`)
          console.log(`  TraineeName: ${record.traineeName}`)
          console.log(`  EmployeeId: ${record.employeeId}`)
          console.log(`  PreferredDepartment: ${record.preferredDepartment}`)
          console.log(`  InstitutionName: ${record.institutionName}`)
          console.log(`  CourseDetails: ${record.courseDetails}`)
          console.log(`  InternshipDuration: ${record.internshipDuration}`)
          console.log(`  Skills: ${record.skills}`)
          console.log(`  ProjectInterests: ${record.projectInterests}`)
          console.log(`  CreatedAt: ${record.createdAt}`)
          console.log(`  UpdatedAt: ${record.updatedAt}`)
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
    console.error('❌ Error in approved trainee check:', error)
  }
}

checkApprovedTrainee() 