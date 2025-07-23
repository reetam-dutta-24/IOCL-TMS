"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar, 
  Users, 
  BookOpen,
  ChevronRight,
  Download,
  Share
} from "lucide-react"

interface PerformanceAnalyticsProps {
  traineeId: string
}

export function PerformanceAnalytics({ traineeId }: PerformanceAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "overall">("month")

  // Mock data for analytics
  const weeklyPerformance = [
    { week: "Week 1", technical: 6.5, behavioral: 7.0, overall: 65, attendance: 100 },
    { week: "Week 2", technical: 7.2, behavioral: 7.5, overall: 72, attendance: 95 },
    { week: "Week 3", technical: 7.8, behavioral: 8.0, overall: 78, attendance: 100 },
    { week: "Week 4", technical: 8.0, behavioral: 8.2, overall: 82, attendance: 90 },
    { week: "Week 5", technical: 8.2, behavioral: 8.5, overall: 85, attendance: 100 },
    { week: "Week 6", technical: 8.5, behavioral: 8.8, overall: 88, attendance: 95 },
    { week: "Week 7", technical: 8.7, behavioral: 9.0, overall: 90, attendance: 100 },
    { week: "Week 8", technical: 8.9, behavioral: 9.2, overall: 92, attendance: 100 }
  ]

  const skillsRadarData = [
    { skill: "Programming", current: 8.5, target: 9.0 },
    { skill: "Problem Solving", current: 8.2, target: 8.5 },
    { skill: "Communication", current: 7.8, target: 8.5 },
    { skill: "Teamwork", current: 9.0, target: 9.0 },
    { skill: "Time Management", current: 7.5, target: 8.0 },
    { skill: "Leadership", current: 6.8, target: 7.5 }
  ]

  const achievements = [
    {
      title: "React Mastery",
      description: "Completed advanced React concepts",
      date: "2024-01-15",
      type: "technical",
      points: 150
    },
    {
      title: "Team Player",
      description: "Excellent collaboration skills",
      date: "2024-01-10",
      type: "behavioral",
      points: 100
    },
    {
      title: "Fast Learner",
      description: "Quickly adapted to new technologies",
      date: "2024-01-05",
      type: "learning",
      points: 120
    },
    {
      title: "Perfect Attendance",
      description: "100% attendance for 4 weeks",
      date: "2024-01-01",
      type: "attendance",
      points: 80
    }
  ]

  const mentorFeedbackTrends = [
    { period: "Week 1-2", rating: 7.0, feedback: "Good start, eager to learn" },
    { period: "Week 3-4", rating: 7.8, feedback: "Showing improvement in technical skills" },
    { period: "Week 5-6", rating: 8.5, feedback: "Excellent progress, taking initiative" },
    { period: "Week 7-8", rating: 9.0, feedback: "Outstanding performance, mentor others" }
  ]

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "technical": return "🔧"
      case "behavioral": return "🤝"
      case "learning": return "📚"
      case "attendance": return "📅"
      default: return "🏆"
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "technical": return "bg-blue-100 text-blue-800"
      case "behavioral": return "bg-green-100 text-green-800"
      case "learning": return "bg-purple-100 text-purple-800"
      case "attendance": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your internship journey</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-3xl font-bold text-green-600">8.9</p>
                <p className="text-xs text-green-600">↗ +0.2 this week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-3xl font-bold text-blue-600">{achievements.length}</p>
                <p className="text-xs text-blue-600">450 total points</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goals Completed</p>
                <p className="text-3xl font-bold text-purple-600">12</p>
                <p className="text-xs text-purple-600">3 in progress</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-3xl font-bold text-orange-600">97%</p>
                <p className="text-xs text-orange-600">Above average</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
              <TabsTrigger value="skills">Skills Radar</TabsTrigger>
              <TabsTrigger value="feedback">Mentor Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyPerformance}>
                    <defs>
                      <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'overall' ? `${value}%` : `${value}/10`,
                        name === 'overall' ? 'Overall Progress' : 
                        name === 'technical' ? 'Technical Skills' :
                        name === 'behavioral' ? 'Behavioral Rating' : 'Attendance'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="overall" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorOverall)" 
                    />
                    <Line type="monotone" dataKey="technical" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="behavioral" stroke="#f59e0b" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillsRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar 
                      name="Current Level" 
                      dataKey="current" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Target Level" 
                      dataKey="target" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.1} 
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="space-y-4">
                {mentorFeedbackTrends.map((feedback, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{feedback.period}</h4>
                        <Badge variant="secondary">{feedback.rating}/10</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feedback.feedback}</p>
                      <Progress value={feedback.rating * 10} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getAchievementIcon(achievement.type)}</span>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getAchievementColor(achievement.type)} variant="secondary">
                        {achievement.type}
                      </Badge>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        +{achievement.points} pts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Skills Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillsRadarData.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{skill.current}/10</span>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-green-600">{skill.target}/10</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={(skill.current / 10) * 100} className="h-2" />
                  <div 
                    className="absolute top-0 h-2 w-1 bg-green-500 rounded-full"
                    style={{ left: `${(skill.target / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Focus Area: Leadership Skills</h4>
              <p className="text-sm text-blue-700">
                Consider taking on more initiative in team projects to develop leadership capabilities.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Strength: Technical Excellence</h4>
              <p className="text-sm text-green-700">
                Your technical skills are progressing excellently. Consider mentoring junior trainees.
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">Opportunity: Time Management</h4>
              <p className="text-sm text-orange-700">
                Work on planning and prioritization skills to improve efficiency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}