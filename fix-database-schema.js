const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema...');

    // Add the status column to forwarded_student_details table
    try {
      await prisma.$executeRaw`
        ALTER TABLE forwarded_student_details 
        ADD COLUMN status TEXT DEFAULT 'PENDING_LND_REVIEW'
      `;
      console.log('✅ Successfully added status column to forwarded_student_details table');
    } catch (error) {
      console.log('ℹ️ Status column might already exist:', error.message);
    }

    // Add the updatedAt column to forwarded_student_details table
    try {
      await prisma.$executeRaw`
        ALTER TABLE forwarded_student_details 
        ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      `;
      console.log('✅ Successfully added updatedAt column to forwarded_student_details table');
    } catch (error) {
      console.log('ℹ️ UpdatedAt column might already exist:', error.message);
    }

    // Update existing records to have the default status
    try {
      await prisma.$executeRaw`
        UPDATE forwarded_student_details 
        SET status = 'PENDING_LND_REVIEW' 
        WHERE status IS NULL
      `;
      console.log('✅ Updated existing records with default status');
    } catch (error) {
      console.log('ℹ️ Status update might not be needed:', error.message);
    }

    // Update existing records to have updatedAt = createdAt
    try {
      await prisma.$executeRaw`
        UPDATE forwarded_student_details 
        SET updatedAt = createdAt 
        WHERE updatedAt IS NULL
      `;
      console.log('✅ Updated existing records with updatedAt = createdAt');
    } catch (error) {
      console.log('ℹ️ UpdatedAt update might not be needed:', error.message);
    }

    // Verify the table structure
    const tableInfo = await prisma.$queryRaw`
      PRAGMA table_info(forwarded_student_details)
    `;
    console.log('📋 Current table structure:');
    console.table(tableInfo);

    console.log('✅ Database schema fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabaseSchema(); 