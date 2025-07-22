import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create Roles - Based on Project Requirements
  const ldCoordinatorRole = await prisma.role.upsert({
    where: { name: "L&D Coordinator" },
    update: {},
    create: {
      name: "L&D Coordinator",
      description: "Learning & Development Coordinator - Initial processing and coordination",
      permissions: {
        requests: ["create", "read", "update"],
        mentors: ["read"],
        reports: ["create", "read"],
        users: ["read"],
        dashboard: ["read"],
      },
    },
  })

  const ldHodRole = await prisma.role.upsert({
    where: { name: "L&D HoD" },
    update: {},
    create: {
      name: "L&D HoD",
      description: "Learning & Development Head of Department - Final approval and policy oversight",
      permissions: {
        requests: ["create", "read", "update", "approve", "reject"],
        mentors: ["create", "read", "update"],
        reports: ["create", "read", "update"],
        users: ["read", "update"],
        dashboard: ["read", "admin"],
        closure: ["approve"],
      },
    },
  })

  const deptHodRole = await prisma.role.upsert({
    where: { name: "Department HoD" },
    update: {},
    create: {
      name: "Department HoD",
      description: "Department Head of Department - Mentor assignment and departmental coordination",
      permissions: {
        requests: ["read", "update"],
        mentors: ["assign", "read", "update"],
        reports: ["read"],
        users: ["read"],
        dashboard: ["read"],
        departmental: ["manage"],
      },
    },
  })

  const mentorRole = await prisma.role.upsert({
    where: { name: "Mentor" },
    update: {},
    create: {
      name: "Mentor",
      description: "Trainee Mentor - Direct supervision and guidance",
      permissions: {
        requests: ["read"],
        mentors: ["read"],
        reports: ["create", "read", "update"],
        trainees: ["manage"],
        progress: ["update"],
        evaluation: ["create", "update"],
      },
    },
  })

  // Admin role for system management
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "System Administrator with full access",
      permissions: {
        users: ["create", "read", "update", "delete"],
        requests: ["create", "read", "update", "delete"],
        mentors: ["create", "read", "update", "delete"],
        reports: ["create", "read", "update", "delete"],
        system: ["manage"],
      },
    },
  })

  // Create Departments
  const ldDept = await prisma.department.upsert({
    where: { code: "LD" },
    update: {},
    create: {
      name: "Learning & Development",
      code: "LD",
      description: "Manages all training and development programs",
      isActive: true,
    },
  })

  const itDept = await prisma.department.upsert({
    where: { code: "IT" },
    update: {},
    create: {
      name: "Information Technology",
      code: "IT",
      description: "Handles all IT infrastructure and development",
      isActive: true,
    },
  })

  const opsDept = await prisma.department.upsert({
    where: { code: "OPS" },
    update: {},
    create: {
      name: "Operations",
      code: "OPS",
      description: "Manages operational activities",
      isActive: true,
    },
  })

  const engDept = await prisma.department.upsert({
    where: { code: "ENG" },
    update: {},
    create: {
      name: "Engineering",
      code: "ENG",
      description: "Engineering and maintenance department",
      isActive: true,
    },
  })

  const finDept = await prisma.department.upsert({
    where: { code: "FIN" },
    update: {},
    create: {
      name: "Finance",
      code: "FIN",
      description: "Financial management and accounting",
      isActive: true,
    },
  })

  const hrDept = await prisma.department.upsert({
    where: { code: "HR" },
    update: {},
    create: {
      name: "Human Resources",
      code: "HR",
      description: "Human resource management and employee relations",
      isActive: true,
    },
  })

  // Create Users - Covering all roles
  const users = [
    {
      employeeId: "EMP001",
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh.kumar@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543210",
      roleId: ldHodRole.id,
      departmentId: ldDept.id,
      isActive: true,
    },
    {
      employeeId: "EMP002",
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543211",
      roleId: ldCoordinatorRole.id,
      departmentId: ldDept.id,
      isActive: true,
    },
    {
      employeeId: "EMP003",
      firstName: "Amit",
      lastName: "Singh",
      email: "amit.singh@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543212",
      roleId: deptHodRole.id,
      departmentId: itDept.id,
      isActive: true,
    },
    {
      employeeId: "EMP004",
      firstName: "Vikram",
      lastName: "Gupta",
      email: "vikram.gupta@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543213",
      roleId: mentorRole.id,
      departmentId: itDept.id,
      isActive: true,
    },
    {
      employeeId: "EMP005",
      firstName: "Meera",
      lastName: "Joshi",
      email: "meera.joshi@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543214",
      roleId: mentorRole.id,
      departmentId: opsDept.id,
      isActive: true,
    },
    {
      employeeId: "EMP006",
      firstName: "Suresh",
      lastName: "Patel",
      email: "suresh.patel@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543215",
      roleId: deptHodRole.id,
      departmentId: engDept.id,
      isActive: true,
    },
    {
      employeeId: "EMP007",
      firstName: "Kavita",
      lastName: "Verma",
      email: "kavita.verma@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543216",
      roleId: deptHodRole.id,
      departmentId: finDept.id,
      isActive: true,
    },
    {
      employeeId: "ADMIN001",
      firstName: "System",
      lastName: "Admin",
      email: "admin@iocl.co.in",
      password: await hashPassword("admin123"),
      phone: "+91-9876543200",
      roleId: adminRole.id,
      departmentId: itDept.id,
      isActive: true,
    },
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { employeeId: userData.employeeId },
      update: {},
      create: userData,
    })
  }

  // Create Sample Internship Requests
  const requests = [
    {
      requestNumber: "REQ001",
      traineeName: "Arjun Reddy",
      traineeEmail: "arjun.reddy@student.edu",
      traineePhone: "+91-8765432109",
      institutionName: "IIT Delhi",
      courseDetails: "Computer Science Engineering",
      internshipDuration: 60,
      preferredDepartment: itDept.id,
      requestDescription: "Summer internship in software development and AI/ML projects",
      priority: "HIGH" as const,
      status: "SUBMITTED" as const,
      requestedBy: 2, // Priya Sharma (L&D Coordinator)
    },
    {
      requestNumber: "REQ002",
      traineeName: "Sneha Agarwal",
      traineeEmail: "sneha.agarwal@student.edu",
      traineePhone: "+91-8765432108",
      institutionName: "NIT Trichy",
      courseDetails: "Information Technology",
      internshipDuration: 90,
      preferredDepartment: itDept.id,
      requestDescription: "Internship in data analytics and business intelligence",
      priority: "MEDIUM" as const,
      status: "UNDER_REVIEW" as const,
      requestedBy: 2,
    },
    {
      requestNumber: "REQ003",
      traineeName: "Rohit Sharma",
      traineeEmail: "rohit.sharma@student.edu",
      traineePhone: "+91-8765432107",
      institutionName: "BITS Pilani",
      courseDetails: "Mechanical Engineering",
      internshipDuration: 120,
      preferredDepartment: engDept.id,
      requestDescription: "Internship in process engineering and automation",
      priority: "HIGH" as const,
      status: "APPROVED" as const,
      requestedBy: 2,
    },
    {
      requestNumber: "REQ004",
      traineeName: "Ananya Das",
      traineeEmail: "ananya.das@student.edu",
      traineePhone: "+91-8765432106",
      institutionName: "IIM Calcutta",
      courseDetails: "Financial Management",
      internshipDuration: 45,
      preferredDepartment: finDept.id,
      requestDescription: "Internship in financial planning and analysis",
      priority: "MEDIUM" as const,
      status: "MENTOR_ASSIGNED" as const,
      requestedBy: 2,
    },
    {
      requestNumber: "REQ005",
      traineeName: "Karthik Nair",
      traineeEmail: "karthik.nair@student.edu",
      traineePhone: "+91-8765432105",
      institutionName: "Anna University",
      courseDetails: "Chemical Engineering",
      internshipDuration: 180,
      preferredDepartment: opsDept.id,
      requestDescription: "Internship in refinery operations and process optimization",
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      requestedBy: 2,
    },
  ]

  for (const requestData of requests) {
    await prisma.internshipRequest.upsert({
      where: { requestNumber: requestData.requestNumber },
      update: {},
      create: requestData,
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log("📋 Created roles:")
  console.log("   - L&D Coordinator (EMP002 - Priya Sharma)")
  console.log("   - L&D HoD (EMP001 - Rajesh Kumar)")
  console.log("   - Department HoD (EMP003 - Amit Singh, EMP006 - Suresh Patel, EMP007 - Kavita Verma)")
  console.log("   - Mentor (EMP004 - Vikram Gupta, EMP005 - Meera Joshi)")
  console.log("   - Admin (ADMIN001 - System Admin)")
  console.log("🏢 Created departments: L&D, IT, Operations, Engineering, Finance, HR")
  console.log("📝 Created 5 sample internship requests")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });