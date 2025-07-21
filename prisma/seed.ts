import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create Roles
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
      },
    },
  })

  const hodRole = await prisma.role.upsert({
    where: { name: "L&D HoD" },
    update: {},
    create: {
      name: "L&D HoD",
      description: "Learning & Development Head of Department",
      permissions: {
        users: ["read", "update"],
        requests: ["create", "read", "update"],
        mentors: ["create", "read", "update"],
        reports: ["create", "read"],
      },
    },
  })

  const coordinatorRole = await prisma.role.upsert({
    where: { name: "L&D Coordinator" },
    update: {},
    create: {
      name: "L&D Coordinator",
      description: "Learning & Development Coordinator",
      permissions: {
        requests: ["create", "read", "update"],
        mentors: ["read"],
        reports: ["create", "read"],
      },
    },
  })

  const mentorRole = await prisma.role.upsert({
    where: { name: "Mentor" },
    update: {},
    create: {
      name: "Mentor",
      description: "Trainee Mentor",
      permissions: {
        requests: ["read"],
        mentors: ["read"],
        reports: ["create", "read"],
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

  // Create Users
  const users = [
    {
      employeeId: "EMP001",
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh.kumar@iocl.co.in",
      password: await hashPassword("demo123"),
      phone: "+91-9876543210",
      roleId: hodRole.id,
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
      roleId: coordinatorRole.id,
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
      roleId: hodRole.id,
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
      requestDescription: "Summer internship in software development",
      priority: "HIGH" as const,
      status: "SUBMITTED" as const,
      requestedBy: 2, // Priya Sharma
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
      requestDescription: "Internship in data analytics and AI",
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
      requestDescription: "Internship in process engineering",
      priority: "HIGH" as const,
      status: "APPROVED" as const,
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
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
