"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IndianOilLogo } from "@/components/ui/logo"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    role: "L&D Coordinator",
    reason: ""
  })

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.employeeId || !formData.firstName || !formData.lastName || 
        !formData.email || !formData.password || !formData.department || !formData.role) {
      setError("Please fill in all required fields")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setPageLoading(true)
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Registration request failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration form...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen tams-gradient-light flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Card className="shadow-lg border-red-100">
            <CardContent className="p-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Your access request has been submitted to the IOCL TAMS administrators. 
                You can now login with your credentials immediately.
              </p>
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <p className="text-sm text-gray-500">Redirecting to login page...</p>
              </div>
              <Link href="/login">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Go to Login Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen tams-gradient-light flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <IndianOilLogo width={48} height={48} className="mr-2" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IOCL TAMS</h1>
              <p className="text-sm text-gray-600">Trainee Approval & Management System</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request System Access</h2>
          <p className="text-gray-600">Please fill out the form below to request access to TAMS</p>
        </div>

        <Card className="shadow-lg border-red-100">
          <CardHeader className="text-center">
            <CardTitle className="text-red-900">Access Request Form</CardTitle>
            <CardDescription>
              Please provide your details to request access to the IOCL TAMS system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="EMP001"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@iocl.co.in"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91-9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)} disabled={loading}>
                    <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Learning & Development">Learning & Development</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Requested Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} disabled={loading}>
                  <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L&D Coordinator">L&D Coordinator</SelectItem>
                    <SelectItem value="L&D HoD">L&D HoD</SelectItem>
                    <SelectItem value="Department HoD">Department HoD</SelectItem>
                    <SelectItem value="Mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Access Request</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you need access to TAMS and how you plan to use it..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="border-red-200 focus:border-red-500 focus:ring-red-500"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Important Notes:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Registration creates account immediately - no approval required</li>
                  <li>• You can login right after successful registration</li>
                  <li>• Please ensure all information is accurate</li>
                  <li>• Contact IT support if you encounter any issues</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have access?{" "}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}