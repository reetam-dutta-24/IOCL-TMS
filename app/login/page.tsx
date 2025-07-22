"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IndianOilLogo } from "@/components/ui/logo"
import { PageLoading } from "@/components/ui/loading"
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    employeeId: "",
    password: ""
  })

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
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

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/dashboard")
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError("")
  }

  if (isPageLoading) {
    return <PageLoading message="Loading Login Portal..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access IOCL TAMS</p>
        </div>

        {/* Login Form */}
        <Card className="animate-slide-in-up animate-delay-400 hover-lift border-red-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your employee credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-slide-in-up">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2 animate-slide-in-left animate-delay-600">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  placeholder="Enter your Employee ID"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2 animate-slide-in-right animate-delay-700">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
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
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white btn-animate hover-lift hover-glow animate-slide-in-up animate-delay-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center animate-fade-in animate-delay-900">
              <p className="text-sm text-gray-600">
                Don't have access?{" "}
                <Link 
                  href="/register" 
                  className="text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
                >
                  Request System Access
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center animate-fade-in animate-delay-1000">
              <Link 
                href="/forgot-password" 
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center text-sm text-gray-500 animate-slide-in-up animate-delay-1100">
          <p>Need help? Contact support at{" "}
            <Link 
              href="mailto:tams@iocl.co.in" 
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              tams@iocl.co.in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}