"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Save, TrendingUp, Target, BookOpen, Users } from "lucide-react"

interface WeeklyProgressData {
  weekNumber: number
  overallProgress: number
  technicalSkillRating: number
  behavioralRating: number
  attendancePercentage: number
  goalsAchieved: string[]
  challengesFaced: string
  learningHighlights: string
  nextWeekGoals: string[]
  selfAssessmentScore: number
}

interface WeeklyProgressFormProps {
  traineeId: string
  currentWeek: number
  onSubmit?: (data: WeeklyProgressData) => void
}

export function WeeklyProgressForm({ traineeId, currentWeek, onSubmit }: WeeklyProgressFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<WeeklyProgressData>({
    weekNumber: currentWeek,
    overallProgress: 0,
    technicalSkillRating: 0,
    behavioralRating: 0,
    attendancePercentage: 100,
    goalsAchieved: [],
    challengesFaced: "",
    learningHighlights: "",
    nextWeekGoals: [],
    selfAssessmentScore: 0
  })
  
  const [newGoalAchieved, setNewGoalAchieved] = useState("")
  const [newNextWeekGoal, setNewNextWeekGoal] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // In real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      if (onSubmit) {
        onSubmit(formData)
      }
      
      // Reset form
      setFormData({
        weekNumber: currentWeek + 1,
        overallProgress: 0,
        technicalSkillRating: 0,
        behavioralRating: 0,
        attendancePercentage: 100,
        goalsAchieved: [],
        challengesFaced: "",
        learningHighlights: "",
        nextWeekGoals: [],
        selfAssessmentScore: 0
      })
      
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to submit progress:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addGoalAchieved = () => {
    if (newGoalAchieved.trim()) {
      setFormData({
        ...formData,
        goalsAchieved: [...formData.goalsAchieved, newGoalAchieved.trim()]
      })
      setNewGoalAchieved("")
    }
  }

  const removeGoalAchieved = (index: number) => {
    const updated = formData.goalsAchieved.filter((_, i) => i !== index)
    setFormData({ ...formData, goalsAchieved: updated })
  }

  const addNextWeekGoal = () => {
    if (newNextWeekGoal.trim()) {
      setFormData({
        ...formData,
        nextWeekGoals: [...formData.nextWeekGoals, newNextWeekGoal.trim()]
      })
      setNewNextWeekGoal("")
    }
  }

  const removeNextWeekGoal = (index: number) => {
    const updated = formData.nextWeekGoals.filter((_, i) => i !== index)
    setFormData({ ...formData, nextWeekGoals: updated })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Submit Week {currentWeek} Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Week {formData.weekNumber} Progress Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="overallProgress">Overall Progress (%)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.overallProgress}
                    onChange={(e) => setFormData({
                      ...formData,
                      overallProgress: parseInt(e.target.value)
                    })}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm font-medium">{formData.overallProgress}%</span>
                </div>
                <Progress value={formData.overallProgress} className="mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technicalRating">Technical Skills (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={formData.technicalSkillRating}
                    onChange={(e) => setFormData({
                      ...formData,
                      technicalSkillRating: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="behavioralRating">Behavioral Rating (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={formData.behavioralRating}
                    onChange={(e) => setFormData({
                      ...formData,
                      behavioralRating: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="attendance">Attendance Percentage</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendancePercentage}
                  onChange={(e) => setFormData({
                    ...formData,
                    attendancePercentage: parseInt(e.target.value)
                  })}
                />
              </div>

              <div>
                <Label htmlFor="selfAssessment">Self Assessment Score (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={formData.selfAssessmentScore}
                  onChange={(e) => setFormData({
                    ...formData,
                    selfAssessmentScore: parseFloat(e.target.value)
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Goals Achieved */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals Achieved This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter goal achieved..."
                  value={newGoalAchieved}
                  onChange={(e) => setNewGoalAchieved(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoalAchieved()}
                />
                <Button onClick={addGoalAchieved} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.goalsAchieved.map((goal, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeGoalAchieved(index)}
                  >
                    {goal} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning & Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="learningHighlights">Key Learning Highlights</Label>
                <Textarea
                  placeholder="Describe your main learnings this week..."
                  value={formData.learningHighlights}
                  onChange={(e) => setFormData({
                    ...formData,
                    learningHighlights: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="challengesFaced">Challenges Faced</Label>
                <Textarea
                  placeholder="Describe any challenges or difficulties..."
                  value={formData.challengesFaced}
                  onChange={(e) => setFormData({
                    ...formData,
                    challengesFaced: e.target.value
                  })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Next Week Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Next Week Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter goal for next week..."
                  value={newNextWeekGoal}
                  onChange={(e) => setNewNextWeekGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNextWeekGoal()}
                />
                <Button onClick={addNextWeekGoal} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.nextWeekGoals.map((goal, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeNextWeekGoal(index)}
                  >
                    {goal} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Progress Report
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}