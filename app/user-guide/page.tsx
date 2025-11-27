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
        content: "Upload supporting documents such as recommendation letters, academic transcripts, and identification. Ensure files are in PDF format and under 10MB each."
      },
      {
        step: 3,
        title: "Tracking Status",
        description: "Monitoring request progress and updates",
        content: "View request status in real-time through the dashboard. Receive notifications for status changes and respond to any additional requirements promptly."
      },
      {
        step: 4,
        title: "Communication",
        description: "Interacting with reviewers and stakeholders",
        content: "Use the built-in messaging system to communicate with L&D coordinators, mentors, and administrators. All communications are logged for reference."
      }
    ],
    "reporting": [
      {
        step: 1,
        title: "Accessing Reports",
        description: "Navigating to the reports section",
        content: "Access the Reports section from the main navigation. Choose from various report types based on your role and permissions."
      },
      {
        step: 2,
        title: "Generating Reports",
        description: "Creating custom reports with filters",
        content: "Select report parameters including date range, department, status, and other filters. Generate reports in PDF or Excel format for download."
      },
      {
        step: 3,
        title: "Scheduled Reports",
        description: "Setting up automated report generation",
        content: "Configure automated reports to be generated and emailed on a schedule. Useful for regular monitoring and compliance requirements."
      },
      {
        step: 4,
        title: "Data Analysis",
        description: "Understanding report metrics and insights",
        content: "Interpret report data to identify trends, bottlenecks, and opportunities for improvement in the training and mentorship programs."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center">
                <IndianOilLogo width={40} height={40} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TAMS User Guide</h1>
                  <p className="text-sm text-gray-600">Comprehensive guide to using IOCL TAMS</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                <BookOpen className="h-3 w-3 mr-1" />
                Documentation
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/user-guide.pdf';
                  link.download = 'IOCL_TAMS_User_Guide.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
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
            Welcome to IOCL TAMS User Guide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This comprehensive guide will help you navigate and make the most of the 
            Trainee Approval & Management System. Follow the step-by-step instructions 
            to get started and master all features.
          </p>
        </div>

        {/* Guide Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Getting Started</span>
            </TabsTrigger>
            <TabsTrigger value="account-management" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account Management</span>
            </TabsTrigger>
            <TabsTrigger value="request-management" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Request Management</span>
            </TabsTrigger>
            <TabsTrigger value="reporting" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reporting</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          {Object.entries(guideSteps).map(([tabKey, steps]) => (
            <TabsContent key={tabKey} value={tabKey}>
              <div className="grid gap-6">
                {steps.map((step, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{step.step}</span>
                        </div>
                        <div className="flex-grow">
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{step.content}</p>
                      {index < steps.length - 1 && (
                        <div className="mt-4 flex justify-end">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Access Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Role-Based Features</CardTitle>
                <CardDescription>
                  Learn about features specific to your role
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Security Guidelines</CardTitle>
                <CardDescription>
                  Best practices for account security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure your preferences and settings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Additional Help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact">
              <Button variant="outline">
                Contact Support
              </Button>
            </Link>
            <Link href="/faq">
              <Button>
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}