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
      where: { name: "Trainee" },
      update: {},
      create: { name: "Trainee", description: "Internship Trainee" },
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
      where: { code: "FIN" },
      update: {},
      create: { name: "Finance", code: "FIN", description: "Finance Department" },
    }),
    prisma.department.upsert({
      where: { code: "OPS" },
      update: {},
      create: { name: "Operations", code: "OPS", description: "Operations Department" },
    }),
  ])

  console.log("✅ Departments created")

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("demo123", 10)

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
        phone: "+91-9876543210",
        roleId: roles.find(r => r.name === "L&D HoD")!.id,
        departmentId: departments.find(d => d.code === "L&D")!.id,
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
        phone: "+91-9876543211",
        roleId: roles.find(r => r.name === "L&D Coordinator")!.id,
        departmentId: departments.find(d => d.code === "L&D")!.id,
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
        phone: "+91-9876543212",
        roleId: roles.find(r => r.name === "Department HoD")!.id,
        departmentId: departments.find(d => d.code === "IT")!.id,
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "IOCL004" },
      update: {},
      create: {
        employeeId: "IOCL004",
        firstName: "Sunita",
        lastName: "Patel",
        email: "sunita.patel@iocl.co.in",
        password: hashedPassword,
        phone: "+91-9876543213",
        roleId: roles.find(r => r.name === "Mentor")!.id,
        departmentId: departments.find(d => d.code === "IT")!.id,
      },
    }),
    // Trainee users
    prisma.user.upsert({
      where: { employeeId: "TRN001" },
      update: {},
      create: {
        employeeId: "TRN001",
        firstName: "Arjun",
        lastName: "Reddy",
        email: "arjun.reddy@student.edu",
        password: hashedPassword,
        phone: "+91-8765432109",
        roleId: roles.find(r => r.name === "Trainee")!.id,
        departmentId: departments.find(d => d.code === "IT")!.id,
        institutionName: "IIT Delhi",
        courseDetails: "Computer Science Engineering",
        expectedGraduation: new Date("2024-06-30"),
        currentSemester: "8th Semester",
        cgpa: 8.5,
        skills: ["Python", "React", "Node.js", "Database Management"],
      },
    }),
    prisma.user.upsert({
      where: { employeeId: "TRN002" },
      update: {},
      create: {
        employeeId: "TRN002",
        firstName: "Sneha",
        lastName: "Agarwal",
        email: "sneha.agarwal@student.edu",
        password: hashedPassword,
        phone: "+91-8765432108",
        roleId: roles.find(r => r.name === "Trainee")!.id,
        departmentId: departments.find(d => d.code === "IT")!.id,
        institutionName: "NIT Trichy",
        courseDetails: "Information Technology",
        expectedGraduation: new Date("2024-05-15"),
        currentSemester: "Final Year",
        cgpa: 9.1,
        skills: ["Java", "Spring Boot", "Angular", "Machine Learning"],
      },
    }),
  ])

  console.log("✅ Users created")

  // Create learning resources
  const learningResources = await Promise.all([
    prisma.learningResource.create({
      data: {
        title: "IOCL Training Manual",
        description: "Comprehensive training manual for new trainees",
        resourceType: "DOCUMENT",
        content: "Complete guide to IOCL processes and procedures",
        departmentId: departments.find(d => d.code === "L&D")!.id,
      },
    }),
    prisma.learningResource.create({
      data: {
        title: "IT Department Guidelines",
        description: "Technical guidelines and best practices",
        resourceType: "DOCUMENT",
        content: "Software development standards and protocols",
        departmentId: departments.find(d => d.code === "IT")!.id,
      },
    }),
    prisma.learningResource.create({
      data: {
        title: "Safety Training Video",
        description: "Workplace safety and emergency procedures",
        resourceType: "VIDEO",
        content: "https://example.com/safety-video",
        departmentId: departments.find(d => d.code === "OPS")!.id,
      },
    }),
  ])

  console.log("✅ Learning resources created")

  // Create internship requests
  const traineeUser1 = users.find(u => u.employeeId === "TRN001")!
  const traineeUser2 = users.find(u => u.employeeId === "TRN002")!
  const coordinatorUser = users.find(u => u.employeeId === "IOCL002")!

  const internshipRequests = await Promise.all([
    prisma.internshipRequest.create({
      data: {
        requestNumber: "REQ001",
        traineeName: "Arjun Reddy",
        traineeEmail: "arjun.reddy@student.edu",
        traineePhone: "+91-8765432109",
        traineeId: traineeUser1.id,
        institutionName: "IIT Delhi",
        courseDetails: "Computer Science Engineering",
        internshipDuration: 60,
        preferredDepartment: departments.find(d => d.code === "IT")!.id,
        requestDescription: "Summer internship in software development",
        status: "IN_PROGRESS",
        priority: "HIGH",
        requestedBy: coordinatorUser.id,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-03-15"),
      },
    }),
    prisma.internshipRequest.create({
      data: {
        requestNumber: "REQ002",
        traineeName: "Sneha Agarwal",
        traineeEmail: "sneha.agarwal@student.edu",
        traineePhone: "+91-8765432108",
        traineeId: traineeUser2.id,
        institutionName: "NIT Trichy",
        courseDetails: "Information Technology",
        internshipDuration: 90,
        preferredDepartment: departments.find(d => d.code === "IT")!.id,
        requestDescription: "Internship in data analytics and AI",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        requestedBy: coordinatorUser.id,
        startDate: new Date("2024-01-10"),
        endDate: new Date("2024-04-10"),
      },
    }),
  ])

  console.log("✅ Internship requests created")

  // Create mentor assignments
  const mentorUser = users.find(u => u.employeeId === "IOCL004")!

  const mentorAssignments = await Promise.all([
    prisma.mentorAssignment.create({
      data: {
        internshipRequestId: internshipRequests[0].id,
        mentorId: mentorUser.id,
        assignedBy: coordinatorUser.id,
        assignmentStatus: "ACTIVE",
        startDate: new Date("2024-01-15"),
        notes: "Focus on full-stack development skills",
      },
    }),
    prisma.mentorAssignment.create({
      data: {
        internshipRequestId: internshipRequests[1].id,
        mentorId: mentorUser.id,
        assignedBy: coordinatorUser.id,
        assignmentStatus: "ACTIVE",
        startDate: new Date("2024-01-10"),
        notes: "Emphasis on machine learning and data analytics",
      },
    }),
  ])

  console.log("✅ Mentor assignments created")

  // Create trainee goals
  const traineeGoals = await Promise.all([
    // Goals for Arjun
    prisma.traineeGoal.create({
      data: {
        traineeId: traineeUser1.id,
        goalTitle: "Master React Framework",
        goalDescription: "Become proficient in React.js development",
        goalType: "TECHNICAL",
        priority: "HIGH",
        targetDate: new Date("2024-02-15"),
        progressPercent: 75,
      },
    }),
    prisma.traineeGoal.create({
      data: {
        traineeId: traineeUser1.id,
        goalTitle: "Complete Database Project",
        goalDescription: "Design and implement a database management system",
        goalType: "PROJECT",
        priority: "HIGH",
        targetDate: new Date("2024-03-01"),
        progressPercent: 45,
      },
    }),
    // Goals for Sneha
    prisma.traineeGoal.create({
      data: {
        traineeId: traineeUser2.id,
        goalTitle: "Machine Learning Certification",
        goalDescription: "Complete ML course and certification",
        goalType: "LEARNING",
        priority: "MEDIUM",
        targetDate: new Date("2024-03-30"),
        progressPercent: 60,
      },
    }),
  ])

  console.log("✅ Trainee goals created")

  // Create trainee progress records
  const traineeProgress = await Promise.all([
    // Week 1 progress for Arjun
    prisma.traineeProgress.create({
      data: {
        traineeId: traineeUser1.id,
        weekNumber: 1,
        overallProgress: 15,
        technicalSkillRating: 7.5,
        behavioralRating: 8.0,
        attendancePercentage: 100,
        goalsAchieved: ["Setup development environment", "Completed orientation"],
        challengesFaced: "Initial learning curve with company's tech stack",
        learningHighlights: "Understanding IOCL's software architecture",
        mentorFeedback: "Good start, enthusiastic learner",
        selfAssessmentScore: 7.0,
        nextWeekGoals: ["Start React component development", "Complete first assignment"],
      },
    }),
    // Week 2 progress for Arjun
    prisma.traineeProgress.create({
      data: {
        traineeId: traineeUser1.id,
        weekNumber: 2,
        overallProgress: 30,
        technicalSkillRating: 8.0,
        behavioralRating: 8.5,
        attendancePercentage: 100,
        goalsAchieved: ["Created first React component", "Completed coding assignment"],
        challengesFaced: "Understanding complex state management",
        learningHighlights: "React hooks and context API",
        mentorFeedback: "Excellent progress, good problem-solving skills",
        selfAssessmentScore: 8.0,
        nextWeekGoals: ["Implement routing", "Start database integration"],
      },
    }),
    // Week 1 progress for Sneha
    prisma.traineeProgress.create({
      data: {
        traineeId: traineeUser2.id,
        weekNumber: 1,
        overallProgress: 20,
        technicalSkillRating: 8.5,
        behavioralRating: 9.0,
        attendancePercentage: 100,
        goalsAchieved: ["Completed data analysis basics", "Set up ML environment"],
        challengesFaced: "Understanding company's data structure",
        learningHighlights: "Data preprocessing techniques",
        mentorFeedback: "Strong analytical skills, quick learner",
        selfAssessmentScore: 8.5,
        nextWeekGoals: ["Implement first ML model", "Data visualization project"],
      },
    }),
  ])

  console.log("✅ Trainee progress created")

  // Create trainee submissions
  const traineeSubmissions = await Promise.all([
    prisma.traineeSubmission.create({
      data: {
        traineeId: traineeUser1.id,
        submissionType: "WEEKLY_REPORT",
        title: "Week 1 Progress Report",
        description: "Summary of first week achievements and learnings",
        content: "Completed orientation and initial setup tasks",
        status: "APPROVED",
        mentorFeedback: "Well documented progress report",
        grade: "A",
      },
    }),
    prisma.traineeSubmission.create({
      data: {
        traineeId: traineeUser1.id,
        submissionType: "ASSIGNMENT",
        title: "React Component Assignment",
        description: "Create a responsive user interface component",
        content: "Implemented user profile component with form validation",
        status: "UNDER_REVIEW",
      },
    }),
    prisma.traineeSubmission.create({
      data: {
        traineeId: traineeUser2.id,
        submissionType: "PROJECT_DELIVERABLE",
        title: "Data Analysis Report",
        description: "Analysis of customer behavior patterns",
        content: "Comprehensive analysis with visualizations and insights",
        status: "APPROVED",
        mentorFeedback: "Excellent analysis and clear presentation",
        grade: "A+",
      },
    }),
  ])

  console.log("✅ Trainee submissions created")

  // Create sample messages
  const traineeMessages = await Promise.all([
    prisma.traineeMessage.create({
      data: {
        senderId: traineeUser1.id,
        receiverId: mentorUser.id,
        subject: "Question about React state management",
        message: "Hi, I'm having trouble understanding when to use useContext vs Redux. Could you help clarify?",
        isRead: true,
        readAt: new Date(),
      },
    }),
    prisma.traineeMessage.create({
      data: {
        senderId: mentorUser.id,
        receiverId: traineeUser1.id,
        subject: "Re: Question about React state management",
        message: "Great question! For smaller applications, useContext is sufficient. Redux is better for complex state management. Let's discuss this in our next meeting.",
        isRead: false,
      },
    }),
    prisma.traineeMessage.create({
      data: {
        senderId: traineeUser2.id,
        receiverId: coordinatorUser.id,
        subject: "Internship Extension Request",
        message: "I would like to request an extension of my internship to complete the ML project. Could we discuss this?",
        isRead: false,
      },
    }),
  ])

  console.log("✅ Trainee messages created")

  // Create notifications for trainees
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: traineeUser1.id,
        type: "IN_APP",
        title: "New Assignment Posted",
        message: "Your mentor has posted a new assignment: Advanced React Patterns",
        priority: "MEDIUM",
      },
    }),
    prisma.notification.create({
      data: {
        userId: traineeUser1.id,
        type: "IN_APP",
        title: "Weekly Report Due",
        message: "Your weekly progress report is due tomorrow",
        priority: "HIGH",
      },
    }),
    prisma.notification.create({
      data: {
        userId: traineeUser2.id,
        type: "IN_APP",
        title: "Goal Achievement",
        message: "Congratulations! You've completed your Data Visualization goal",
        priority: "LOW",
      },
    }),
  ])

  console.log("✅ Notifications created")

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
