"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, Calendar, CheckCircle, Clock, Play } from "lucide-react"
import { GoalType, Priority, GoalStatus } from "@/types"

interface Goal {
  id: number
  goalTitle: string
  goalDescription?: string
  goalType: GoalType
  priority: Priority
  targetDate: string
  status: GoalStatus
  progressPercent: number
  createdAt: string
}

interface GoalsSectionProps {
  userId: string
}

export function GoalsSection({ userId }: GoalsSectionProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    goalTitle: "",
    goalDescription: "",
    goalType: "LEARNING" as GoalType,
    priority: "MEDIUM" as Priority,
    targetDate: ""
  })

  useEffect(() => {
    loadGoals()
  }, [userId])

  const loadGoals = async () => {
    try {
      // Mock data for demonstration
      const mockGoals: Goal[] = [
        {
          id: 1,
          goalTitle: "Master React Framework",
          goalDescription: "Become proficient in React.js development including hooks, context, and state management",
          goalType: "TECHNICAL",
          priority: "HIGH",
          targetDate: "2024-02-15",
          status: "ACTIVE",
          progressPercent: 75,
          createdAt: "2024-01-01"
        },
        {
          id: 2,
          goalTitle: "Complete Database Project",
          goalDescription: "Design and implement a comprehensive database management system",
          goalType: "PROJECT",
          priority: "HIGH",
          targetDate: "2024-03-01",
          status: "ACTIVE",
          progressPercent: 45,
          createdAt: "2024-01-05"
        },
        {
          id: 3,
          goalTitle: "Improve Communication Skills",
          goalDescription: "Enhance presentation and interpersonal communication abilities",
          goalType: "BEHAVIORAL",
          priority: "MEDIUM",
          targetDate: "2024-02-28",
          status: "ACTIVE",
          progressPercent: 60,
          createdAt: "2024-01-10"
        },
        {
          id: 4,
          goalTitle: "Complete Python Certification",
          goalDescription: "Earn professional Python programming certification",
          goalType: "LEARNING",
          priority: "MEDIUM",
          targetDate: "2024-01-20",
          status: "COMPLETED",
          progressPercent: 100,
          createdAt: "2023-12-15"
        }
      ]
      setGoals(mockGoals)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load goals:", error)
      setLoading(false)
    }
  }

  const handleCreateGoal = async () => {
    try {
      // In real implementation, this would call the API
      const goal: Goal = {
        id: goals.length + 1,
        ...newGoal,
        status: "ACTIVE",
        progressPercent: 0,
        createdAt: new Date().toISOString()
      }
      
      setGoals([...goals, goal])
      setNewGoal({
        goalTitle: "",
        goalDescription: "",
        goalType: "LEARNING",
        priority: "MEDIUM",
        targetDate: ""
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create goal:", error)
    }
  }

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "ACTIVE":
        return <Play className="h-4 w-4 text-blue-600" />
      case "PAUSED":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "ACTIVE":
        return "bg-blue-100 text-blue-800"
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
    }
  }

  const getTypeColor = (type: GoalType) => {
    switch (type) {
      case "TECHNICAL":
        return "bg-purple-100 text-purple-800"
      case "LEARNING":
        return "bg-blue-100 text-blue-800"
      case "BEHAVIORAL":
        return "bg-orange-100 text-orange-800"
      case "PROJECT":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div>Loading goals...</div>
  }

  const activeGoals = goals.filter(goal => goal.status === "ACTIVE")
  const completedGoals = goals.filter(goal => goal.status === "COMPLETED")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Goals</h3>
          <p className="text-sm text-gray-600">Track your learning and development objectives</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalTitle">Goal Title</Label>
                <Input
                  id="goalTitle"
                  value={newGoal.goalTitle}
                  onChange={(e) => setNewGoal({ ...newGoal, goalTitle: e.target.value })}
                  placeholder="Enter goal title"
                />
              </div>
              <div>
                <Label htmlFor="goalDescription">Description</Label>
                <Textarea
                  id="goalDescription"
                  value={newGoal.goalDescription}
                  onChange={(e) => setNewGoal({ ...newGoal, goalDescription: e.target.value })}
                  placeholder="Describe your goal"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goalType">Type</Label>
                  <Select value={newGoal.goalType} onValueChange={(value: GoalType) => setNewGoal({ ...newGoal, goalType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEARNING">Learning</SelectItem>
                      <SelectItem value="TECHNICAL">Technical</SelectItem>
                      <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                      <SelectItem value="PROJECT">Project</SelectItem>
                      <SelectItem value="PERSONAL">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value: Priority) => setNewGoal({ ...newGoal, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      <div>
        <h4 className="font-medium mb-3">Active Goals ({activeGoals.length})</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {activeGoals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(goal.status)}
                    <CardTitle className="text-base">{goal.goalTitle}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getTypeColor(goal.goalType)} variant="secondary">
                      {goal.goalType}
                    </Badge>
                    <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                      {goal.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{goal.goalDescription}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progressPercent}%</span>
                  </div>
                  <Progress value={goal.progressPercent} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Completed Goals ({completedGoals.length})</h4>
          <div className="grid gap-3">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{goal.goalTitle}</p>
                        <p className="text-sm text-gray-500">
                          Completed on {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getTypeColor(goal.goalType)} variant="secondary">
                        {goal.goalType}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800" variant="secondary">
                        COMPLETED
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first learning goal</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  )
}