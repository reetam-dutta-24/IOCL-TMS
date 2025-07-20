# IOCL Trainee Management System

A comprehensive trainee and internship management system built for Indian Oil Corporation Limited (IOCL).

## Features

- **User Authentication**: Secure login with role-based access control
- **Request Management**: Submit, track, and manage internship requests
- **Mentor Assignment**: Intelligent mentor matching and assignment
- **Approval Workflow**: Multi-level approval process with notifications
- **Dashboard Analytics**: Comprehensive reporting and analytics
- **Document Management**: File upload and document handling
- **Notifications**: Real-time notifications via email, SMS, and in-app
- **Multi-department Support**: Support for various departments and locations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **File Storage**: AWS S3 (optional)
- **Email**: Nodemailer with SMTP
- **SMS**: Twilio (optional)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-org/iocl-tms.git
cd iocl-tms
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`
Edit `.env` with your configuration values.

4. Set up the database:
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database
npx prisma db seed
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`.

### Demo Credentials

- **L&D HoD**: IOCL001 / demo123
- **L&D Coordinator**: IOCL002 / demo123  
- **Department HoD**: IOCL003 / demo123
- **Mentor**: IOCL004 / demo123

## Project Structure

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── requests/          # Request management pages
│   ├── mentors/           # Mentor management pages
│   └── login/             # Authentication pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── forms/            # Form components
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── context/              # React context providers
├── types/                # TypeScript type definitions
└── prisma/               # Database schema and migrations
\`\`\`

## Database Schema

The system uses PostgreSQL with the following main entities:

- **Users**: System users with role-based access
- **Roles**: User roles (Admin, L&D HoD, Coordinator, etc.)
- **Departments**: Organizational departments
- **InternshipRequests**: Internship applications
- **MentorAssignments**: Mentor-intern relationships
- **Approvals**: Multi-level approval workflow
- **Notifications**: System notifications
- **DocumentAttachments**: File uploads and documents

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Internship Requests
- `GET /api/internships` - List requests
- `POST /api/internships` - Create request
- `GET /api/internships/[id]` - Get request details
- `PUT /api/internships/[id]` - Update request
- `POST /api/internships/[id]/approve` - Approve/reject request

### Mentors
- `GET /api/mentors` - List mentors
- `POST /api/mentors/assign` - Assign mentor

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Notifications
- `GET /api/notifications` - User notifications
- `POST /api/notifications/[id]/read` - Mark as read

## Deployment

### Using Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically

### Using Docker

1. Build the Docker image:
\`\`\`bash
docker build -t iocl-tms .
\`\`\`

2. Run with Docker Compose:
\`\`\`bash
docker-compose up -d
\`\`\`

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: NextAuth secret key
- `FROM_EMAIL`: Email sender address
- `AWS_*`: AWS S3 configuration (optional)
- `TWILIO_*`: SMS configuration (optional)

### Role-based Access Control

The system supports the following roles:

- **Admin**: Full system access
- **L&D HoD**: Learning & Development Head of Department
- **L&D Coordinator**: Request coordination and management
- **Department HoD**: Department-specific approvals
- **Mentor**: Trainee mentoring and guidance

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is proprietary software developed for Indian Oil Corporation Limited.

## Support

For support and questions, please contact:
- Email: support@iocl.co.in
- Internal IT Helpdesk: ext. 1234

---

© 2024 Indian Oil Corporation Limited. All rights reserved.
