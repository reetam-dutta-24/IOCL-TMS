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
    prisma.role.upsert({
      where: { name: "Employee" },
      update: {},
      create: { name: "Employee", description: "Regular Employee" },
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
      where: { employeeId: "EMP001" },
      update: {},
      create: {
        employeeId: "EMP001",
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh.kumar@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "L&D HoD")!.id,
        departmentId: departments.find((d) => d.code === "L&D")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "EMP002" },
      update: {},
      create: {
        employeeId: "EMP002",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "L&D Coordinator")!.id,
        departmentId: departments.find((d) => d.code === "L&D")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "EMP003" },
      update: {},
      create: {
        employeeId: "EMP003",
        firstName: "Amit",
        lastName: "Singh",
        email: "amit.singh@iocl.co.in",
        password: hashedPassword,
        roleId: roles.find((r) => r.name === "Department HoD")!.id,
        departmentId: departments.find((d) => d.code === "IT")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "EMP004" },
      update: {},
      create: {
        employeeId: "EMP004",
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

  // Create system configuration
  await Promise.all([
    prisma.systemConfig.upsert({
      where: { key: "MAX_MENTOR_CAPACITY" },
      update: {},
      create: { key: "MAX_MENTOR_CAPACITY", value: "3", description: "Maximum number of trainees per mentor" },
    }),
    prisma.systemConfig.upsert({
      where: { key: "AUTO_APPROVAL_THRESHOLD" },
      update: {},
      create: { key: "AUTO_APPROVAL_THRESHOLD", value: "30", description: "Auto-approval threshold in days" },
    }),
    prisma.systemConfig.upsert({
      where: { key: "EMAIL_NOTIFICATIONS_ENABLED" },
      update: {},
      create: { key: "EMAIL_NOTIFICATIONS_ENABLED", value: "true", description: "Enable email notifications" },
    }),
  ])

  console.log("✅ System configuration created")
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
