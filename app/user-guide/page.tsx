"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  Shield,
  Play,
  Download,
  CheckCircle,
  ArrowRight,
  User,
  UserCheck,
  Building,
  ClipboardList,
  BarChart3,
  Bell,
  Lock,
  Smartphone,
  Monitor,
  Globe,
  Star
} from "lucide-react"

export default function UserGuidePage() {
  const [activeTab, setActiveTab] = useState("getting-started")

  const guideSteps = {
    "getting-started": [
      {
        step: 1,
        title: "System Overview",
        description: "Understanding IOCL TAMS platform and its purpose",
        content: "IOCL TAMS is a comprehensive digital platform designed to streamline internship processes, mentor assignments, and training program management across all IOCL departments. The system automates workflows, improves efficiency, and provides real-time tracking of training activities."
      },
      {
        step: 2,
        title: "Requesting Access",
        description: "How to register and get approved for TAMS",
        content: "Visit the TAMS homepage and click 'Request Access'. Fill out the registration form with your employee details, department, and role. Submit required documents and wait for admin approval (typically 1-2 business days)."
      },
      {
        step: 3,
        title: "First Login",
        description: "Accessing your account for the first time",
        content: "Once approved, you'll receive login credentials via email. Visit the login page, enter your Employee ID and password. Complete your profile setup and familiarize yourself with the dashboard layout."
      },
      {
        step: 4,
        title: "Dashboard Navigation",
        description: "Understanding the main interface and navigation",
        content: "The dashboard provides quick access to all major functions: Requests management, Mentor assignments, Reports, and Settings. Use the sidebar navigation to switch between different sections of the system."
      }
    ],
    "account-management": [
      {
        step: 1,
        title: "Profile Setup",
        description: "Completing your user profile information",
        content: "Navigate to Settings > Profile to update your personal information, contact details, and professional background. Ensure all required fields are completed for optimal system functionality."
      },
      {
        step: 2,
        title: "Security Settings",
        description: "Configuring password and security preferences",
        content: "Set a strong password and configure security settings. Enable two-factor authentication if available. Review login history and active sessions regularly for security monitoring."
      },
      {
        step: 3,
        title: "Notification Preferences",
        description: "Customizing email and system notifications",
        content: "Configure notification settings to receive updates about request status changes, mentor assignments, deadlines, and system announcements via email or in-app notifications."
      },
      {
        step: 4,
        title: "Role Permissions",
        description: "Understanding your role-based access rights",
        content: "Different roles have specific permissions: L&D Coordinators process requests, HoDs approve and assign mentors, Mentors manage trainees, and Admins oversee system settings."
      }
    ],
    "request-management": [
      {
        step: 1,
        title: "Creating Requests",
        description: "Submitting new internship requests",
        content: "Click 'New Request' in the Requests section. Fill out the form with trainee details, internship duration, preferred department, and description. Attach required documents before submission."
      },
      {
        step: 2,
        title: "Document Upload",
        description: "Attaching required documents to requests",
        content: "Upload documents in PDF format (max 10MB each): institutional letter, academic transcripts, ID proof, and medical certificate. Ensure all documents are clear and complete."
      },
      {
        step: 3,
        title: "Status Tracking",
        description: "Monitoring request progress through approval workflow",
        content: "Track request status in real-time: Submitted → Under Review → Approved → Mentor Assigned → In Progress → Completed. Receive email notifications for status changes."
      },
      {
        step: 4,
        title: "Request Modifications",
        description: "Editing or updating submitted requests",
        content: "Requests can be modified only in 'Submitted' status. Contact your L&D Coordinator for changes after review begins. Major modifications may require a new request submission."
      }
    ],
    "mentor-system": [
      {
        step: 1,
        title: "Mentor Assignment",
        description: "Understanding the automated mentor matching process",
        content: "TAMS uses intelligent algorithms to match mentors based on expertise, workload, availability, and departmental requirements. Department HoDs can manually override assignments when needed."
      },
      {
        step: 2,
        title: "Mentor Profiles",
        description: "Viewing mentor qualifications and expertise",
        content: "Browse mentor profiles to understand their background, specializations, current trainees, and availability. This helps in making informed mentor preference requests."
      },
      {
        step: 3,
        title: "Communication",
        description: "Coordinating with assigned mentors",
        content: "Use the in-system messaging or provided contact details to communicate with mentors. Coordinate start dates, objectives, schedules, and progress updates through proper channels."
      },
      {
        step: 4,
        title: "Evaluation Process",
        description: "Providing feedback on mentorship experience",
        content: "Complete mentor evaluation forms at internship completion. Rate guidance quality, availability, knowledge sharing, and overall experience to help improve the mentorship program."
      }
    ],
    "reports-analytics": [
      {
        step: 1,
        title: "Dashboard Analytics",
        description: "Understanding key metrics and statistics",
        content: "The dashboard displays important metrics: total requests, approval rates, mentor assignments, completion statistics, and departmental breakdowns. Use these insights for decision-making."
      },
      {
        step: 2,
        title: "Custom Reports",
        description: "Generating specific reports for your needs",
        content: "Create custom reports by selecting date ranges, departments, request types, and status filters. Export reports in PDF or Excel format for external use and record-keeping."
      },
      {
        step: 3,
        title: "Performance Tracking",
        description: "Monitoring training program effectiveness",
        content: "Track key performance indicators: request processing time, mentor utilization, trainee satisfaction scores, completion rates, and department-wise statistics for program optimization."
      },
      {
        step: 4,
        title: "Data Export",
        description: "Downloading data for external analysis",
        content: "Export data in various formats (Excel, CSV, PDF) for external analysis, presentations, or compliance reporting. Ensure data privacy and security when handling exported information."
      }
    ]
  }

  const userRoles = [
    {
      role: "L&D Coordinator",
      icon: User,
      color: "bg-blue-100 text-blue-600",
      description: "Initial processing and coordination of internship requests",
      responsibilities: [
        "Process incoming internship requests",
        "Verify documentation and eligibility",
        "Coordinate with departments for approvals",
        "Maintain request records and communication"
      ]
    },
    {
      role: "L&D HoD",
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
      description: "Final approval and policy oversight for training programs",
      responsibilities: [
        "Review and approve internship requests",
        "Set training policies and guidelines",
        "Oversee program quality and outcomes",
        "Make strategic decisions for L&D initiatives"
      ]
    },
    {
      role: "Department HoD",
      icon: Building,
      color: "bg-purple-100 text-purple-600",
      description: "Mentor assignment and departmental coordination",
      responsibilities: [
        "Assign mentors to approved trainees",
        "Manage departmental training resources",
        "Coordinate with mentors and trainees",
        "Ensure department-specific requirements are met"
      ]
    },
    {
      role: "Mentor",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      description: "Direct supervision and guidance of trainees",
      responsibilities: [
        "Provide guidance and supervision to trainees",
        "Conduct regular progress evaluations",
        "Share technical knowledge and skills",
        "Submit completion reports and feedback"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="text-red-600 hover:text-red-700 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center">
                <IndianOilLogo width={40} height={40} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TAMS User Guide</h1>
                  <p className="text-sm text-gray-600">Complete system documentation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                <BookOpen className="h-3 w-3 mr-1" />
                Documentation
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to IOCL TAMS
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your comprehensive guide to using the Trainee Approval & Management System. 
            Learn how to efficiently manage internship processes, mentor assignments, and training programs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Web-Based Platform</h3>
                <p className="text-sm text-gray-600">Access from any modern browser</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Mobile Responsive</h3>
                <p className="text-sm text-gray-600">Works on all devices</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Lock className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-sm text-gray-600">Enterprise-grade security</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Roles Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">User Roles & Responsibilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRoles.map((roleInfo) => (
              <Card key={roleInfo.role} className="border-red-100">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${roleInfo.color}`}>
                    <roleInfo.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{roleInfo.role}</CardTitle>
                  <CardDescription className="text-sm">{roleInfo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {roleInfo.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Step-by-Step Guide</h3>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 mb-8">
              <TabsTrigger value="getting-started" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="account-management" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="request-management" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="mentor-system" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Mentors
              </TabsTrigger>
              <TabsTrigger value="reports-analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            {Object.entries(guideSteps).map(([tabKey, steps]) => (
              <TabsContent key={tabKey} value={tabKey}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {steps.map((step) => (
                    <Card key={step.step} className="border-red-100">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {step.step}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{step.title}</CardTitle>
                            <CardDescription>{step.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">{step.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Quick Tips */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Star className="h-5 w-5" />
                Quick Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Best Practices</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Keep your profile information updated
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Submit complete documentation with requests
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Respond promptly to mentor communications
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Regular check system notifications
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Troubleshooting</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Clear browser cache for performance issues
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Use supported browsers (Chrome, Firefox, Safari)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Contact support with specific error messages
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      Keep login credentials secure and private
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Support Section */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Need Additional Help?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our support team is available to assist you with any questions or issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/faq">
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      View FAQ
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button className="bg-red-600 hover:bg-red-700">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Access TAMS
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}