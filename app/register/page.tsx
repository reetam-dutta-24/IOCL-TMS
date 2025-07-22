"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IndianOilLogo } from "@/components/ui/logo"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, UserPlus } from "lucide-react"

interface Role {
  id: number
  name: string
  description: string
}

interface Department {
  id: number
  name: string
  code: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeId: "",
    requestedRoleId: "",
    departmentId: "",
    institutionName: "",
    purpose: ""
  })

  useEffect(() => {
    // Fetch roles and departments
    const fetchData = async () => {
      try {
        const [rolesRes, deptRes] = await Promise.all([
          fetch("/api/roles"),
          fetch("/api/departments")
        ])

        if (rolesRes.ok) {
          const rolesData = await rolesRes.json()
          setRoles(rolesData)
        }

        if (deptRes.ok) {
          const deptData = await deptRes.json()
          setDepartments(deptData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/access-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(data.error || "Failed to submit access request")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back to Home */}
        <div className="animate-slide-in-down">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors hover-lift"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center animate-scale-in animate-delay-200">
          <div className="flex justify-center mb-6">
            <IndianOilLogo width={60} height={60} className="animate-float" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request System Access</h1>
          <p className="text-gray-600">Submit your details for admin approval</p>
        </div>

        {/* Registration Form */}
        <Card className="animate-slide-in-up animate-delay-400 hover-lift border-red-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Access Request Form</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to request access to IOCL TAMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-slide-in-up">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 animate-slide-in-left animate-delay-600">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right animate-delay-600">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-slide-in-left animate-delay-700">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 animate-slide-in-left animate-delay-800">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right animate-delay-800">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      placeholder="Enter employee ID"
                      value={formData.employeeId}
                      onChange={(e) => handleChange("employeeId", e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 animate-slide-in-left animate-delay-900">
                    <Label htmlFor="role">Requested Role *</Label>
                    <Select
                      value={formData.requestedRoleId}
                      onValueChange={(value) => handleChange("requestedRoleId", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="transition-all duration-300 hover:border-red-300">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 animate-slide-in-right animate-delay-900">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) => handleChange("departmentId", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="transition-all duration-300 hover:border-red-300">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 animate-slide-in-up animate-delay-1000">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    placeholder="Enter institution name (if applicable)"
                    value={formData.institutionName}
                    onChange={(e) => handleChange("institutionName", e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2 animate-slide-in-up animate-delay-1100">
                  <Label htmlFor="purpose">Purpose/Reason for Access</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Briefly explain why you need access to TAMS"
                    value={formData.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white btn-animate hover-lift hover-glow animate-slide-in-up animate-delay-1200"
                  disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email || !formData.employeeId || !formData.requestedRoleId}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Submit Access Request
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Request Submitted Successfully!</h3>
                <p className="text-gray-600">
                  Your access request has been submitted for admin approval. 
                  You'll receive an email once your request is reviewed.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/">Return to Home</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Already have access? Sign In</Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center animate-fade-in animate-delay-1300">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}