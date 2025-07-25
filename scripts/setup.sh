#!/bin/bash

echo "🚀 Setting up IOCL TAMS project..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure your database URL."
    echo "Example DATABASE_URL: postgresql://username:password@localhost:5432/iocl_tms"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npm run db:generate

echo "🗃️ Setting up database..."
# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set in .env file. Using SQLite for development..."
    export DATABASE_URL="file:./dev.db"
fi

echo "📊 Pushing database schema..."
npm run db:push

echo "🌱 Seeding database with initial data..."
npm run db:seed

echo "✅ Setup complete! You can now run the project with:"
echo "   npm run dev"
echo ""
echo "🔐 Default login credentials:"
echo "   Employee ID: EMP001, Password: demo123 (L&D HoD)"
echo "   Employee ID: EMP002, Password: demo123 (L&D Coordinator)"
echo "   Employee ID: EMP003, Password: demo123 (Department HoD)"
echo "   Employee ID: EMP004, Password: demo123 (Mentor)"
echo "   Employee ID: EMP005, Password: demo123 (Mentor)"