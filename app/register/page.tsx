"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IndianOilLogo } from "@/components/ui/logo"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, UserPlus } from "lucide-react"

interface Role {
  id: number
  name: string
  description: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
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
    purpose: ""
  })

  useEffect(() => {
    // Fetch roles only (departments are now static)
    const fetchData = async () => {
      setIsDataLoading(true)
      try {
        const rolesRes = await fetch("/api/roles")

        if (rolesRes.ok) {
          const rolesData = await rolesRes.json()
          setRoles(rolesData)
        } else {
          console.error("Failed to fetch roles:", await rolesRes.text())
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Failed to load form data. Please refresh the page.")
      } finally {
        setIsDataLoading(false)
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

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId || !formData.password || !formData.confirmPassword || !formData.requestedRoleId) {
      setError("Please fill in all required fields.")
      setIsLoading(false)
      return
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/register-direct", {
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
          <Button 
            asChild 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all"
          >
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Logo and Title - Positioned Above Form */}
        <div className="text-center animate-scale-in animate-delay-200">
          <div className="flex justify-center mb-4">
            <IndianOilLogo width={60} height={60} className="animate-float" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Register for IOCL Training & Assessment Management System</p>
        </div>

        {/* Registration Form */}
        <Card className="animate-slide-in-up animate-delay-400 hover-lift border-red-100">
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert className="border-red-200 bg-red-50 animate-shake">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4 animate-fade-in animate-delay-700">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-600">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading || isDataLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2 animate-slide-in-right animate-delay-600">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading || isDataLoading}
                        required
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
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading || isDataLoading}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-750">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading || isDataLoading}
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
                        disabled={isLoading || isDataLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-850">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        required
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading || isDataLoading}
                      />
                    </div>

                    <div className="space-y-2 animate-slide-in-right animate-delay-850">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        required
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading || isDataLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Role and Department */}
                <div className="space-y-4 animate-fade-in animate-delay-900">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Role & Department</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left animate-delay-900">
                      <Label htmlFor="role">Requested Role *</Label>
                      <Select
                        value={formData.requestedRoleId}
                        onValueChange={(value) => handleChange("requestedRoleId", value)}
                        disabled={isLoading || isDataLoading}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:border-red-300">
                          <SelectValue placeholder={isDataLoading ? "Loading roles..." : "Select your role"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {roles.length > 0 ? (
                            roles
                              .filter((role) => role.name !== 'System Administrator' && role.name !== 'Admin')
                              .map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{role.name}</span>
                                    {role.description && (
                                      <span className="text-xs text-gray-500">{role.description}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              {isDataLoading ? "Loading..." : "No roles available"}
                            </SelectItem>
                          )}
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
                          <SelectValue placeholder="Select department (optional)" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="1">
                            <div className="flex flex-col">
                              <span className="font-medium">Learning & Development</span>
                              <span className="text-xs text-gray-500">Code: LD</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="2">
                            <div className="flex flex-col">
                              <span className="font-medium">Information Technology</span>
                              <span className="text-xs text-gray-500">Code: IT</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="3">
                            <div className="flex flex-col">
                              <span className="font-medium">Operations</span>
                              <span className="text-xs text-gray-500">Code: OPS</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="4">
                            <div className="flex flex-col">
                              <span className="font-medium">Engineering</span>
                              <span className="text-xs text-gray-500">Code: ENG</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="5">
                            <div className="flex flex-col">
                              <span className="font-medium">Finance</span>
                              <span className="text-xs text-gray-500">Code: FIN</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="6">
                            <div className="flex flex-col">
                              <span className="font-medium">Human Resources</span>
                              <span className="text-xs text-gray-500">Code: HR</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 animate-fade-in animate-delay-1100">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  
                  <div className="space-y-2 animate-slide-in-left animate-delay-1100">
                    <Label htmlFor="institutionName">Institution/Organization Name</Label>
                    <Input
                      id="institutionName"
                      placeholder="Enter institution or organization name (if applicable)"
                      value={formData.institutionName}
                      onChange={(e) => handleChange("institutionName", e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading || isDataLoading}
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right animate-delay-1200">
                    <Label htmlFor="purpose">Purpose/Reason for Access</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Briefly describe why you need access to the system (e.g., training participation, assessment, research, etc.)"
                      value={formData.purpose}
                      onChange={(e) => handleChange("purpose", e.target.value)}
                      className="min-h-[80px] transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading || isDataLoading}
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 transition-all animate-fade-in animate-delay-1300 transform hover:scale-[1.02]"
                  disabled={isLoading || isDataLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Account Created Successfully!</h3>
                <p className="text-gray-600">
                  Your account has been created and you can now login with your credentials.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 mb-4">
                  <h4 className="font-semibold text-green-900">Login Instructions:</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>Employee ID:</strong> {formData.employeeId}</p>
                    <p><strong>Password:</strong> The password you just created</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="/login">Login Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                    <Link href="/">Return to Home</Link>
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

        {/* Help Text */}
        <Card className="animate-slide-in-up animate-delay-1400 border-blue-200 bg-blue-50">
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