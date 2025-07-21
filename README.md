# IOCL TAMS - Trainee Approval & Management System

## 🎯 Overview

IOCL TAMS (Trainee Approval & Management System) is a comprehensive web application designed to streamline the internship and trainee management process for Indian Oil Corporation Limited (IOCL). The system facilitates the entire lifecycle of trainee applications from submission to completion with **full database integration**, **real authentication**, and **role-based access control**.

## ✨ Key Features

### 🔐 **Full Authentication & Security**
- **Real Database Authentication**: BCrypt password hashing with JWT tokens
- **Role-Based Access Control**: Different interfaces and permissions for each role
- **Session Management**: HTTP-only cookies with secure token handling
- **Route Protection**: Middleware-based route protection

### 👥 **User Roles**

1. **L&D HoD (Head of Department)**
   - Oversee all training programs
   - Approve/reject high-priority requests
   - Access to all system reports and analytics
   - Manage department policies

2. **L&D Coordinator**
   - Process incoming trainee applications
   - Coordinate with departments for mentor assignments
   - Generate and distribute reports
   - Handle day-to-day operations

3. **Department HoD**
   - Review requests for their specific department
   - Approve mentor assignments
   - Monitor departmental trainee progress

4. **Mentor**
   - Manage assigned trainees
   - Submit progress reports
   - Provide feedback and evaluations

### 🗄️ **Database-Driven Features**
- **Dynamic Dashboard**: Real-time stats from PostgreSQL database
- **CRUD Operations**: Full Create, Read, Update, Delete for all entities
- **Real User Registration**: New users saved to database with role assignment
- **Dynamic Data Rendering**: All pages pull live data from database
- **Audit Trail**: Complete tracking of all system activities

## 🚀 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with custom red theme
- **Radix UI**: Accessible component library
- **Lucide React**: Icon library

### Backend & Database
- **Prisma ORM**: Type-safe database client
- **PostgreSQL**: Production database
- **SQLite**: Development database (fallback)
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing

### API & Integration
- **Next.js API Routes**: RESTful API endpoints
- **Real-time Data**: Dynamic dashboard with live statistics
- **File Upload**: Document management system
- **Email Integration**: Notification system

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page with red theme
│   ├── login/             # Authentication pages
│   ├── register/          # User registration
│   ├── dashboard/         # Role-based dashboard
│   ├── requests/          # Request management
│   ├── mentors/           # Mentor management
│   ├── reports/           # Reports and analytics
│   ├── settings/          # User settings
│   └── api/               # Database-connected API routes
│       ├── auth/          # Authentication APIs
│       ├── requests/      # Request management APIs
│       ├── mentors/       # Mentor management APIs
│       └── dashboard/     # Dashboard statistics APIs
├── components/            # Reusable UI components
│   ├── ui/                # Radix UI components
│   ├── dashboard-layout.tsx
│   ├── stats-card.tsx
│   ├── recent-activity.tsx
│   └── requests-table.tsx
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Database client
│   └── auth.ts            # Authentication utilities
├── prisma/                # Database schema and seed
│   ├── schema.prisma      # Complete database schema
│   └── seed.ts            # Initial data seeding
├── middleware.ts          # Route protection
└── .env                   # Environment configuration
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL (or SQLite for development)
- npm or yarn

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd iocl-tams
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Database Setup (Automated)**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

4. **Manual Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed with initial data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### 🔑 Default Login Credentials

| Role | Employee ID | Password | Access Level |
|------|-------------|----------|--------------|
| L&D HoD | EMP001 | demo123 | Full system access |
| L&D Coordinator | EMP002 | demo123 | Request & mentor management |
| Department HoD | EMP003 | demo123 | Department-specific access |
| Mentor | EMP004 | demo123 | Trainee management |
| Mentor | EMP005 | demo123 | Trainee management |

## 🗃️ Database Schema

### Core Entities
- **Users**: Employee profiles with role-based permissions
- **Roles**: System roles with granular permissions
- **Departments**: Organizational structure
- **Internship Requests**: Trainee applications with full lifecycle
- **Mentor Assignments**: Mentor-trainee relationships
- **Project Reports**: Progress tracking and evaluations
- **Audit Trail**: Complete system activity logging

### Example Database URL
```env
# PostgreSQL (Production)
DATABASE_URL="postgresql://username:password@localhost:5432/iocl_tms?schema=public"

# SQLite (Development)
DATABASE_URL="file:./dev.db"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth` - User login with database validation
- `POST /api/auth/register` - User registration to database
- `GET /api/auth/me` - Get current user profile

### Requests Management
- `GET /api/requests` - Fetch requests from database
- `POST /api/requests` - Create new request in database
- `PUT /api/requests/[id]` - Update request
- `DELETE /api/requests/[id]` - Delete request

### Mentors Management
- `GET /api/mentors` - Fetch mentors with active assignments
- `POST /api/mentors/assign` - Assign mentor to trainee

### Dashboard Analytics
- `GET /api/dashboard/stats` - Real-time dashboard statistics
- Role-based data filtering and permissions

## 🎨 UI/UX Features

### 🔴 **Custom Red Theme**
- IOCL-branded red color scheme throughout
- Consistent design language
- Professional corporate styling

### 📱 **Responsive Design**
- Mobile-first approach
- Works on all device sizes
- Touch-friendly interface

### ♿ **Accessibility**
- WCAG 2.1 compliant
- Screen reader compatible
- Keyboard navigation support

## 🔒 Security Features

- **Password Security**: BCrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication with HTTP-only cookies
- **Role Validation**: Server-side permission checking
- **Input Sanitization**: Prisma ORM prevents SQL injection
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: SameSite cookie configuration

## 📊 Dynamic Features

### Dashboard
- **Real-time Statistics**: Live data from database
- **Role-based Views**: Different dashboards per user role
- **Interactive Charts**: Data visualization with Recharts
- **Recent Activity**: Live activity feed

### Request Management
- **Full CRUD Operations**: Create, read, update, delete requests
- **Status Tracking**: Real-time status updates
- **File Uploads**: Document attachment system
- **Search & Filter**: Advanced filtering capabilities

### Mentor System
- **Dynamic Assignment**: Algorithm-based mentor matching
- **Capacity Management**: Workload balancing
- **Performance Tracking**: Mentor evaluation system

## 🚢 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t iocl-tams .
docker run -p 3000:3000 iocl-tams
```

### Database Migration
```bash
npm run db:migrate
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
```

## ✅ Verification Checklist

- ✅ **Database Integration**: PostgreSQL with Prisma ORM
- ✅ **Real Authentication**: BCrypt + JWT with database validation
- ✅ **Role-Based Access**: Different permissions per user role
- ✅ **Dynamic Data**: All pages connected to database
- ✅ **CRUD Operations**: Full create, read, update, delete functionality
- ✅ **User Registration**: New users saved to database
- ✅ **Session Management**: Secure token-based sessions
- ✅ **Route Protection**: Middleware-based access control
- ✅ **Red Theme**: Consistent IOCL branding
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **API Integration**: RESTful endpoints for all operations

## 🎯 **Project Status: PRODUCTION READY** 

The IOCL TAMS system is now fully functional with:
- Complete backend database integration
- Real user authentication and authorization
- Dynamic data rendering from PostgreSQL
- Full CRUD operations for all entities
- Professional red-themed UI
- Mobile-responsive design
- Security best practices implemented

## 📞 Support

For technical support or questions:
- Check the API documentation above
- Review the database schema in `prisma/schema.prisma`
- Check environment variables in `.env.example`
- Review the setup script in `scripts/setup.sh`

## 📄 License

This project is proprietary to Indian Oil Corporation Limited (IOCL).
