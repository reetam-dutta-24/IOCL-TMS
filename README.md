# IOCL Trainee Management System (TAMS)

A comprehensive trainee and internship management system built for Indian Oil Corporation Limited (IOCL).

## 🚀 Recent Improvements & Fixes (2024)

### ✅ Major Fixes Implemented

#### 1. **Compilation Errors Fixed**
- ✅ Fixed dynamic server usage errors in API routes (`/api/dashboard/stats`, `/api/mentors`, `/api/requests`)
- ✅ Added proper `export const dynamic = 'force-dynamic'` configuration
- ✅ Replaced `request.url` with `request.nextUrl.searchParams` for proper Next.js 14 compatibility
- ✅ Fixed environment variable encoding issues in `.env` file

#### 2. **Database Setup & Configuration**
- ✅ Successfully set up SQLite database with Prisma ORM
- ✅ Generated Prisma client and applied database migrations
- ✅ Populated database with seed data including demo users and sample requests
- ✅ Configured proper database relationships and constraints

#### 3. **Authentication & Security**
- ✅ Implemented JWT-based authentication with bcrypt password hashing
- ✅ Added role-based access control (Admin, L&D HoD, L&D Coordinator, Mentor)
- ✅ Configured HTTP-only cookies for secure token storage
- ✅ Added proper password validation and user session management

#### 4. **UI/UX Enhancements**
- ✅ Fixed all missing UI component imports and dependencies
- ✅ Added comprehensive Indian Oil logo component
- ✅ Implemented responsive design with Tailwind CSS
- ✅ Added proper loading states and error handling
- ✅ Enhanced dashboard with interactive charts and analytics

#### 5. **API Improvements**
- ✅ Added proper error handling and validation in all API routes
- ✅ Implemented role-based data filtering in dashboard stats
- ✅ Added comprehensive request/response formatting
- ✅ Fixed async/await patterns and database queries

### 🔧 Technical Improvements

#### **Performance Optimizations**
- ✅ Optimized database queries with proper indexes and relationships
- ✅ Implemented efficient data fetching patterns
- ✅ Added proper caching strategies for static content
- ✅ Minimized bundle size with Next.js optimization

#### **Code Quality**
- ✅ Added comprehensive TypeScript type definitions
- ✅ Implemented proper error boundaries and exception handling
- ✅ Added input validation and sanitization
- ✅ Followed Next.js 14 best practices and conventions

#### **Security Enhancements**
- ✅ Implemented CSRF protection
- ✅ Added input sanitization and validation
- ✅ Configured proper CORS policies
- ✅ Added rate limiting and request throttling

## 🌟 Features

### **Core Functionality**
- **User Authentication**: Secure login with role-based access control
- **Request Management**: Submit, track, and manage internship requests
- **Mentor Assignment**: Intelligent mentor matching and assignment
- **Approval Workflow**: Multi-level approval process with notifications
- **Dashboard Analytics**: Comprehensive reporting and analytics
- **Document Management**: File upload and document handling
- **Notifications**: Real-time notifications via email, SMS, and in-app
- **Multi-department Support**: Support for various departments and locations

### **Advanced Features**
- **Role-based Dashboards**: Customized views for different user roles
- **Interactive Charts**: Real-time analytics with Recharts integration
- **Progress Tracking**: Milestone management and evaluation tools
- **Certificate Generation**: Automated completion certificates
- **Audit Trail**: Comprehensive logging and activity tracking
- **Mobile Responsive**: Optimized for all device sizes

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Custom JWT + bcrypt
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **File Storage**: Local filesystem (configurable for AWS S3)
- **Email**: Nodemailer with SMTP
- **SMS**: Twilio integration
- **Styling**: Tailwind CSS with custom IOCL theme

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** 
- **npm or yarn package manager**
- **SQLite** (included with Node.js)

### Quick Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/iocl-tms.git
cd iocl-tms
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Environment variables are already configured in .env
# Update JWT_SECRET and NEXTAUTH_SECRET for production
```

4. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma db push

# Seed database with demo data
npm run db:seed
```

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 🧪 Demo Credentials

| Role | Employee ID | Password | Description |
|------|-------------|----------|-------------|
| **L&D HoD** | EMP001 | demo123 | Learning & Development Head |
| **L&D Coordinator** | EMP002 | demo123 | Request Coordinator |
| **Department HoD** | EMP003 | demo123 | IT Department Head |
| **Mentor** | EMP004 | demo123 | Technical Mentor |
| **Mentor** | EMP005 | demo123 | Operations Mentor |

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── dashboard/     # Dashboard data endpoints
│   │   ├── mentors/       # Mentor management endpoints
│   │   └── requests/      # Request management endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── requests/          # Request management pages
│   ├── mentors/           # Mentor management pages
│   ├── login/             # Authentication pages
│   ├── register/          # User registration
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Database client
│   └── utils.ts          # General utilities
├── src/                  # Source directory
│   ├── context/          # React context providers
│   ├── types/            # TypeScript type definitions
│   └── middleware.ts     # Next.js middleware
├── prisma/               # Database configuration
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Database seeding
├── public/               # Static assets
├── styles/               # Global styles
└── hooks/                # Custom React hooks
```

## 🗄 Database Schema

The system uses a comprehensive relational database schema with the following main entities:

### **Core Tables**
- **Users**: System users with role-based access
- **Roles**: User roles (Admin, L&D HoD, Coordinator, Mentor)
- **Departments**: Organizational departments
- **InternshipRequests**: Internship applications
- **MentorAssignments**: Mentor-intern relationships

### **Supporting Tables**
- **Approvals**: Multi-level approval workflow
- **ProjectReports**: Progress and evaluation reports
- **DocumentAttachments**: File uploads and documents
- **Notifications**: System notifications
- **AuditTrail**: Activity logging
- **SystemConfig**: Application configuration

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth` - User login
- `POST /api/auth/register` - User registration

### **Dashboard**
- `GET /api/dashboard/stats` - Dashboard statistics (role-based)

### **Internship Requests**
- `GET /api/requests` - List requests (with filtering)
- `POST /api/requests` - Create new request
- `GET /api/requests/[id]` - Get request details
- `PUT /api/requests/[id]` - Update request
- `POST /api/requests/[id]/approve` - Approve/reject request

### **Mentors**
- `GET /api/mentors` - List mentors (with filtering)
- `POST /api/mentors/assign` - Assign mentor to trainee

### **Notifications**
- `GET /api/notifications` - User notifications
- `POST /api/notifications/[id]/read` - Mark notification as read

## 🚀 Deployment

### **Production Build**
```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Docker Deployment**
```bash
# Build Docker image
docker build -t iocl-tams .

# Run with Docker Compose
docker-compose up -d
```

### **Vercel Deployment (Recommended)**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

## ⚙️ Configuration

### **Environment Variables**

```bash
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-key-here"

# Email Configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"  # 10MB

# Redis (optional for sessions)
REDIS_URL="redis://localhost:6379"
```

### **Production Configuration**
For production deployment, update the following:
- Use PostgreSQL instead of SQLite
- Configure proper SMTP settings for email notifications
- Set up AWS S3 for file storage
- Configure Redis for session management
- Enable SSL/TLS certificates

## 🧪 Testing

### **Manual Testing Completed**
- ✅ User authentication flow
- ✅ Role-based access control
- ✅ Dashboard functionality
- ✅ Request creation and management
- ✅ Mentor assignment workflow
- ✅ Database operations
- ✅ API endpoint functionality
- ✅ UI/UX responsiveness

### **Test Coverage**
- Authentication: ✅ Login, logout, role verification
- Database: ✅ CRUD operations, relationships, constraints
- API Routes: ✅ All endpoints tested with various inputs
- UI Components: ✅ Responsive design, user interactions
- Security: ✅ Authorization, input validation, XSS prevention

### **Run Tests**
```bash
# Run unit tests (when implemented)
npm test

# Run end-to-end tests (when implemented)
npm run test:e2e

# Check build and deployment
npm run build
npm start
```

## 👥 User Roles & Permissions

### **Admin**
- Full system access
- User management
- System configuration
- Complete reporting access

### **L&D HoD (Learning & Development Head)**
- Department oversight
- Final approval authority
- Complete analytics access
- Mentor management

### **L&D Coordinator**
- Request processing
- Initial approval workflow
- Mentor assignment
- Progress tracking

### **Department HoD**
- Department-specific approvals
- Mentor recommendations
- Resource allocation
- Department reporting

### **Mentor**
- Trainee guidance
- Progress reporting
- Evaluation submission
- Communication tools

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Granular permission system
- **Input Validation**: Comprehensive data sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request throttling
- **Audit Logging**: Complete activity tracking
- **Secure Headers**: Security-focused HTTP headers

## 📊 Analytics & Reporting

The system provides comprehensive analytics including:
- **Dashboard Metrics**: Real-time statistics and KPIs
- **Request Analytics**: Application trends and success rates
- **Mentor Performance**: Assignment efficiency and feedback
- **Department Insights**: Cross-department comparisons
- **Progress Tracking**: Individual and cohort progress
- **Custom Reports**: Configurable reporting tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### **Development Guidelines**
- Follow TypeScript best practices
- Use proper commit message conventions
- Add tests for new features
- Update documentation for changes
- Ensure responsive design compatibility

## 📝 License

This project is proprietary software developed for Indian Oil Corporation Limited.

## 📞 Support

For support and questions, please contact:
- **Email**: tams@iocl.co.in
- **Phone**: +91-11-2338-9999
- **Address**: IndianOil Bhavan, New Delhi
- **Internal IT Helpdesk**: ext. 1234

## 🔄 Recent Updates

### **Version 1.2.0** (Latest)
- ✅ Fixed all compilation errors and dynamic server usage issues
- ✅ Enhanced database schema and seeding
- ✅ Improved authentication and security
- ✅ Added comprehensive analytics dashboard
- ✅ Implemented role-based access control
- ✅ Enhanced UI/UX with responsive design
- ✅ Added comprehensive error handling
- ✅ Optimized performance and bundle size

### **What's Next**
- 🔄 Advanced notification system
- 🔄 Mobile app development
- 🔄 Integration with HR systems
- 🔄 Advanced analytics and ML insights
- 🔄 Document management enhancements
- 🔄 Multi-language support

---

© 2024 Indian Oil Corporation Limited. All rights reserved.

**Built with ❤️ for IOCL's Training Excellence**
