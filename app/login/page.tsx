"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/src/context/auth-context";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IndianOilLogo } from "@/components/ui/logo"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    password: ""
  })

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.employeeId || !formData.password) {
      setError("Please enter both Employee ID and password")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: formData.employeeId.trim(),
          password: formData.password.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store user data and token
      login(data.user, data.token)
      
      // Show redirecting state
      setRedirecting(true)
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading login page...</p>
        </div>
      </div>
    )
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Successful!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen tams-gradient-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>

        <Card className="shadow-lg border-red-100">
          <CardHeader className="text-center">
            <CardTitle className="text-red-900">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the TAMS dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your employee ID"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  className="border-red-200 focus:border-red-500 focus:ring-red-500"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500 pr-10"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="#" className="text-red-600 hover:text-red-700">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have access?{" "}
                <Link href="/register" className="text-red-600 hover:text-red-700 font-medium">
                  Request access here
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Demo Credentials:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div><strong>L&D HoD:</strong> EMP001 / demo123</div>
                <div><strong>L&D Coordinator:</strong> EMP002 / demo123</div>
                <div><strong>Department HoD:</strong> EMP003 / demo123</div>
                <div><strong>Mentor:</strong> EMP004 / demo123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};