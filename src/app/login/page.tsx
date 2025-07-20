"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Building2, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        employeeId,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid employee ID or password")
      } else {
        const session = await getSession()
        if (session) {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { role: "L&D HoD", id: "IOCL001", password: "demo123" },
    { role: "L&D Coordinator", id: "IOCL002", password: "demo123" },
    { role: "Department HoD", id: "IOCL003", password: "demo123" },
    { role: "Mentor", id: "IOCL004", password: "demo123" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-white to-coral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-coral-600 hover:text-coral-700 hover:bg-coral-50 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-coral-200 shadow-xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-t-lg">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-coral-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-coral-100">Sign in to your IOCL TAMS account</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-gray-700 font-medium">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="border-coral-200 focus:border-coral-500 focus:ring-coral-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-coral-200 focus:border-coral-500 focus:ring-coral-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-coral-300 text-coral-600 focus:ring-coral-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-coral-600 hover:text-coral-700">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-coral-500 hover:bg-coral-600 py-2.5 text-white font-semibold"
                disabled={loading}
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

            <Separator className="my-6" />

            {/* Demo Credentials */}
            <div className="p-4 bg-coral-50 rounded-lg border border-coral-200">
              <h4 className="text-sm font-semibold text-coral-800 mb-3">Demo Credentials:</h4>
              <div className="grid grid-cols-1 gap-2">
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="text-xs text-coral-700 bg-white p-2 rounded border">
                    <div className="font-medium">{cred.role}</div>
                    <div className="text-coral-600">
                      ID: {cred.id} | Pass: {cred.password}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-coral-600 hover:text-coral-700 font-medium">
                  Request Access
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Indian Oil Corporation Limited. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
