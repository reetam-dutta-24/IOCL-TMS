import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "Admin" },
      update: {},
      create: { name: "Admin", description: "System Administrator" },
    }),
    prisma.role.upsert({
      where: { name: "L&D HoD" },
      update: {},
      create: { name: "L&D HoD", description: "Learning & Development Head of Department" },
    }),
    prisma.role.upsert({
      where: { name: "L&D Coordinator" },
      update: {},
      create: { name: "L&D Coordinator", description: "Learning & Development Coordinator" },
    }),
    prisma.role.upsert({
      where: { name: "Department HoD" },
      update: {},
      create: { name: "Department HoD", description: "Department Head of Department" },
    }),
    prisma.role.upsert({
      where: { name: "Mentor" },
      update: {},
      create: { name: "Mentor", description: "Trainee Mentor" },
    }),
  ])

  console.log("✅ Roles created")

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "L&D" },
      update: {},
      create: { name: "Learning & Development", code: "L&D", description: "Learning and Development Department" },
    }),
    prisma.department.upsert({
      where: { code: "IT" },
      update: {},
      create: { name: "Information Technology", code: "IT", description: "Information Technology Department" },
    }),
    prisma.department.upsert({
      where: { code: "HR" },
      update: {},
      create: { name: "Human Resources", code: "HR", description: "Human Resources Department" },
    }),
    prisma.department.upsert({
      where: { code: "OPS" },
      update: {},
      create: { name: "Operations", code: "OPS", description: "Operations Department" },
    }),
    prisma.department.upsert({
      where: { code: "ENG" },
      update: {},
      create: { name: "Engineering", code: "ENG", description: "Engineering Department" },
    }),
    prisma.department.upsert({
      where: { code: "R&D" },
      update: {},
      create: { name: "Research & Development", code: "R&D", description: "Research and Development Department" },
    }),
  ])

  console.log("✅ Departments created")

  // Hash password
  const hashedPassword = await bcrypt.hash("demo123", 12)

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { employeeId: "IOCL001" },
      update: {},
      create: {
        employeeId: "IOCL001",
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh.kumar@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "L&D HoD")!.id,
        departmentId: departments.find((d) => d.code === "L&D")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "IOCL002" },
      update: {},
      create: {
        employeeId: "IOCL002",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "L&D Coordinator")!.id,
        departmentId: departments.find((d) => d.code === "L&D")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "IOCL003" },
      update: {},
      create: {
        employeeId: "IOCL003",
        firstName: "Amit",
        lastName: "Singh",
        email: "amit.singh@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "Department HoD")!.id,
        departmentId: departments.find((d) => d.code === "IT")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "IOCL004" },
      update: {},
      create: {
        employeeId: "IOCL004",
        firstName: "Vikram",
        lastName: "Gupta",
        email: "vikram.gupta@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "Mentor")!.id,
        departmentId: departments.find((d) => d.code === "IT")!.id,
      },
    }),
  ])

  console.log("✅ Users created")

  // Create sample internship requests
  const sampleRequests = await Promise.all([
    prisma.internshipRequest.create({
      data: {
        requestNumber: "IOCL-INT-2024-0001",
        traineeName: "Arjun Reddy",
        traineeEmail: "arjun.reddy@student.edu",
        traineePhone: "+91-8765432109",
        institutionName: "IIT Delhi",
        courseDetails: "Computer Science Engineering",
        internshipDuration: 60,
        preferredDepartment: departments.find((d) => d.code === "IT")!.id,
        requestDescription: "Summer internship in software development",
        priority: "HIGH",
        requestedBy: users.find((u) => u.employeeId === "IOCL002")!.id,
      },
    }),
    prisma.internshipRequest.create({
      data: {
        requestNumber: "IOCL-INT-2024-0002",
        traineeName: "Sneha Agarwal",
        traineeEmail: "sneha.agarwal@student.edu",
        traineePhone: "+91-8765432108",
        institutionName: "NIT Trichy",
        courseDetails: "Information Technology",
        internshipDuration: 90,
        preferredDepartment: departments.find((d) => d.code === "IT")!.id,
        requestDescription: "Internship in data analytics and AI",
        priority: "MEDIUM",
        status: "UNDER_REVIEW",
        requestedBy: users.find((u) => u.employeeId === "IOCL002")!.id,
      },
    }),
  ])

  console.log("✅ Sample requests created")

  console.log("🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
