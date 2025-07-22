"use client"

import { useState } from "react"
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
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, UserPlus, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    requestedRoleId: "",
    departmentId: "",
    institutionName: "",
    purpose: "",
    dateOfBirth: "",
    address: ""
  })

  // Hardcoded roles (only 4 roles as you mentioned)
  const roles = [
    { id: "1", name: "L&D Coordinator", description: "Learning & Development Coordinator" },
    { id: "2", name: "L&D HoD", description: "Learning & Development Head of Department" },
    { id: "3", name: "Department HoD", description: "Department Head of Department" },
    { id: "4", name: "Mentor", description: "Trainee Mentor" }
  ]

  // Hardcoded departments
  const departments = [
    { id: "1", name: "Learning & Development", code: "LD" },
    { id: "2", name: "Information Technology", code: "IT" },
    { id: "3", name: "Operations", code: "OPS" },
    { id: "4", name: "Engineering", code: "ENG" },
    { id: "5", name: "Finance", code: "FIN" },
    { id: "6", name: "Human Resources", code: "HR" }
  ]

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

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId || !formData.password || !formData.requestedRoleId) {
      setError("Please fill in all required fields.")
      setIsLoading(false)
      return
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

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
      <div className="w-full max-w-4xl space-y-6">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-slide-in-up">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2 animate-slide-in-right animate-delay-700">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-800">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
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

                  <div className="space-y-2 animate-slide-in-up animate-delay-900">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Account Setup Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Account Setup
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-1000">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          required
                          className="pr-10 transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">Minimum 6 characters</p>
                    </div>

                    <div className="space-y-2 animate-slide-in-right animate-delay-1000">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                          required
                          className="pr-10 transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role & Department Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Role & Department
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-1100">
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
                            <SelectItem key={role.id} value={role.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{role.name}</span>
                                <span className="text-xs text-gray-500">{role.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 animate-slide-in-right animate-delay-1100">
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
                            <SelectItem key={dept.id} value={dept.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{dept.name}</span>
                                <span className="text-xs text-gray-500">Code: {dept.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Additional Information
                  </h3>

                  <div className="space-y-2 animate-slide-in-up animate-delay-1200">
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

                  <div className="space-y-2 animate-slide-in-up animate-delay-1300">
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white btn-animate hover-lift hover-glow animate-slide-in-up animate-delay-1400"
                  disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email || !formData.employeeId || !formData.password || !formData.requestedRoleId}
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
                  <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                    <Link href="/">Return to Home</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                    <Link href="/login">Already have access? Sign In</Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center animate-fade-in animate-delay-1500">
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

        {/* Help Text */}
        <Card className="animate-slide-in-up animate-delay-1600 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-3">
              If you're having trouble with the registration process or need to select a specific role/department 
              that isn't listed, please contact our support team.
            </p>
            <p className="text-sm text-blue-600">
              📧 Email: <a href="mailto:tams@iocl.co.in" className="hover:underline">tams@iocl.co.in</a><br />
              📞 Phone: +91-11-2338-9999
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}