import { NextRequest, NextResponse } from "next/server"

// Mock goals data
let goals = [
  {
    id: 1,
    traineeId: 1,
    goalTitle: "Master React Framework",
    goalDescription: "Become proficient in React.js development including hooks, context, and state management",
    goalType: "TECHNICAL",
    priority: "HIGH",
    targetDate: "2024-02-15",
    status: "ACTIVE",
    progressPercent: 75,
    createdAt: "2024-01-01T10:00:00Z"
  },
  {
    id: 2,
    traineeId: 1,
    goalTitle: "Complete Database Project",
    goalDescription: "Design and implement a comprehensive database management system",
    goalType: "PROJECT", 
    priority: "HIGH",
    targetDate: "2024-03-01",
    status: "ACTIVE",
    progressPercent: 45,
    createdAt: "2024-01-05T10:00:00Z"
  },
  {
    id: 3,
    traineeId: 1,
    goalTitle: "Improve Communication Skills",
    goalDescription: "Enhance presentation and interpersonal communication abilities",
    goalType: "BEHAVIORAL",
    priority: "MEDIUM", 
    targetDate: "2024-02-28",
    status: "ACTIVE",
    progressPercent: 60,
    createdAt: "2024-01-10T10:00:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const traineeId = searchParams.get("traineeId")
    const status = searchParams.get("status")

    let filteredGoals = goals

    if (traineeId) {
      filteredGoals = filteredGoals.filter(goal => goal.traineeId === parseInt(traineeId))
    }

    if (status) {
      filteredGoals = filteredGoals.filter(goal => goal.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredGoals
    })
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const goalData = await request.json()

    const newGoal = {
      id: goals.length + 1,
      traineeId: parseInt(goalData.traineeId),
      goalTitle: goalData.goalTitle,
      goalDescription: goalData.goalDescription,
      goalType: goalData.goalType,
      priority: goalData.priority,
      targetDate: goalData.targetDate,
      status: "ACTIVE",
      progressPercent: 0,
      createdAt: new Date().toISOString()
    }

    goals.push(newGoal)

    return NextResponse.json(
      {
        success: true,
        data: newGoal
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const goalData = await request.json()
    const goalIndex = goals.findIndex(goal => goal.id === goalData.id)

    if (goalIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Goal not found" },
        { status: 404 }
      )
    }

    goals[goalIndex] = {
      ...goals[goalIndex],
      ...goalData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: goals[goalIndex]
    })
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}