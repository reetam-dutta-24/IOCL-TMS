"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, User, Lock, Users, GraduationCap } from "lucide-react"

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user session
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Redirect based on role
        if (data.user.role === "Trainee") {
          router.push("/trainee")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(data.error || "Login failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (id: string, pwd: string) => {
    setEmployeeId(id)
    setPassword(pwd)
  }

  const staffCredentials = [
    { id: "EMP001", role: "L&D HoD", name: "Rajesh Kumar", department: "Learning & Development" },
    { id: "EMP002", role: "L&D Coordinator", name: "Priya Sharma", department: "Learning & Development" },
    { id: "EMP003", role: "Department HoD", name: "Amit Singh", department: "Information Technology" },
    { id: "EMP004", role: "Mentor", name: "Sunita Patel", department: "Information Technology" },
  ]

  const traineeCredentials = [
    { id: "TRN001", name: "Arjun Reddy", institution: "IIT Delhi", course: "Computer Science Engineering" },
    { id: "TRN002", name: "Sneha Agarwal", institution: "NIT Trichy", course: "Information Technology" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-2" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IOCL-TMS</h1>
              <p className="text-sm text-gray-600">Trainee Management System</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID / Trainee ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="employeeId"
                      type="text"
                      placeholder="Enter your ID (e.g., EMP001 or TRN001)"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Credentials</CardTitle>
              <CardDescription>Click on any credential to quickly fill the login form</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="staff" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="staff" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Staff
                  </TabsTrigger>
                  <TabsTrigger value="trainee" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Trainees
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="staff" className="space-y-3">
                  {staffCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => quickLogin(cred.id, "demo123")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{cred.name}</p>
                          <p className="text-xs text-gray-500">{cred.role}</p>
                          <p className="text-xs text-gray-400">{cred.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono">{cred.id}</p>
                          <p className="text-xs text-gray-500">demo123</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="trainee" className="space-y-3">
                  {traineeCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => quickLogin(cred.id, "demo123")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{cred.name}</p>
                          <p className="text-xs text-gray-500">Trainee</p>
                          <p className="text-xs text-gray-400">{cred.institution}</p>
                          <p className="text-xs text-gray-400">{cred.course}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono">{cred.id}</p>
                          <p className="text-xs text-gray-500">demo123</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>All demo accounts use password:</strong> demo123
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Click any credential above to auto-fill the login form
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 Indian Oil Corporation Limited</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </div>
  )
}
