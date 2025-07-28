"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowRight, 
  Send,
  Users,
  Building,
  GraduationCap,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has L&D Coordinator role
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === 'L&D Coordinator') {
        // Redirect L&D Coordinators to the Send Request page
        router.push("/send-request")
        return
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="text-red-600 hover:text-red-700 mr-4">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center">
                <IndianOilLogo width={40} height={40} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Send Request</h1>
                  <p className="text-sm text-gray-600">L&D Coordinator Portal</p>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Information Alert */}
        <Alert className="border-blue-200 bg-blue-50 mb-8">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>L&D Coordinator Access:</strong> This page has been updated to provide direct access to the trainee request management system. 
            If you're an L&D Coordinator, you'll be automatically redirected to the Send Request portal.
          </AlertDescription>
        </Alert>

        {/* New Send Request Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            L&D Coordinator Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select approved trainees and send their details to LND HOD for review and department assignment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Send Request Card */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                Send Trainee Request
              </CardTitle>
              <CardDescription>
                Access the trainee management system to select approved trainees and forward their details to LND HOD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Select Approved Trainees</p>
                    <p className="text-sm text-gray-600">Choose from approved trainee applications</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Target Department</p>
                    <p className="text-sm text-gray-600">Specify the department for assignment</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Forward to LND HOD</p>
                    <p className="text-sm text-gray-600">Send complete trainee details for review</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/send-request">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Access Send Request Portal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Key Features
              </CardTitle>
              <CardDescription>
                Streamlined workflow for trainee management and department coordination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Bulk Selection</p>
                    <p className="text-sm text-gray-600">Select multiple trainees at once</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Department Filtering</p>
                    <p className="text-sm text-gray-600">Filter by preferred departments</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Detailed View</p>
                    <p className="text-sm text-gray-600">View complete trainee information</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Instant Notification</p>
                    <p className="text-sm text-gray-600">Automatic notification to LND HOD</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              Process Flow
            </CardTitle>
            <CardDescription>
              How the trainee request system works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">1. Select Trainees</h3>
                <p className="text-sm text-gray-600">Choose approved trainees from the list</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">2. Choose Department</h3>
                <p className="text-sm text-gray-600">Select target department for assignment</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">3. Send Request</h3>
                <p className="text-sm text-gray-600">Forward details to LND HOD</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">4. HOD Review</h3>
                <p className="text-sm text-gray-600">LND HOD reviews and approves</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information for Non-Coordinators */}
        <Card className="mt-12 border-gray-200">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              If you're not an L&D Coordinator or need additional assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Support</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> tams@iocl.co.in</p>
                  <p><strong>Phone:</strong> +91-11-2338-9999</p>
                  <p><strong>Hours:</strong> Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/user-guide" className="block text-blue-600 hover:text-blue-700 text-sm">
                    User Guide
                  </Link>
                  <Link href="/faq" className="block text-blue-600 hover:text-blue-700 text-sm">
                    FAQ
                  </Link>
                  <Link href="/dashboard" className="block text-blue-600 hover:text-blue-700 text-sm">
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}