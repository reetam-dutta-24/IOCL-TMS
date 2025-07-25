"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Users, 
  FileText, 
  Settings, 
  Shield,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const faqCategories = [
    {
      category: "Getting Started",
      icon: HelpCircle,
      color: "bg-blue-100 text-blue-600",
      questions: [
        {
          id: 1,
          question: "What is IOCL TAMS?",
          answer: "IOCL TAMS (Trainee Approval & Management System) is a comprehensive digital platform designed to streamline internship processes, mentor assignments, and training program management across all IOCL departments. It automates workflows, improves efficiency, and provides real-time tracking of training activities."
        },
        {
          id: 2,
          question: "How do I request access to TAMS?",
          answer: "To request access, click on 'Request Access' on the homepage and fill out the registration form with your employee details, department, and role. Your request will be reviewed by the system administrators, and you'll receive email confirmation once approved."
        },
        {
          id: 3,
          question: "What are the different user roles in TAMS?",
          answer: "TAMS supports multiple roles: L&D Coordinator (initial processing), L&D HoD (final approval), Department HoD (mentor assignment), Mentor (trainee supervision), and Admin (system management). Each role has specific permissions and responsibilities."
        },
        {
          id: 4,
          question: "Do I need special software to use TAMS?",
          answer: "No, TAMS is a web-based application that works on any modern browser (Chrome, Firefox, Safari, Edge). No additional software installation is required. You just need an internet connection and valid login credentials."
        }
      ]
    },
    {
      category: "Account & Access",
      icon: Users,
      color: "bg-green-100 text-green-600",
      questions: [
        {
          id: 5,
          question: "I forgot my password. How can I reset it?",
          answer: "Click on 'Forgot Password' on the login page and enter your employee ID or email. You'll receive a password reset link via email. Follow the instructions to create a new password. If you don't receive the email, contact IT support."
        },
        {
          id: 6,
          question: "Can I change my account details after registration?",
          answer: "Basic profile information can be updated through your account settings. However, critical details like employee ID and department may require admin approval. Contact your system administrator for significant changes."
        },
        {
          id: 7,
          question: "Why is my account access restricted?",
          answer: "Account access may be restricted due to pending approval, inactive status, or security policy violations. Contact your department HoD or system administrator to resolve access issues and understand the specific reason for restrictions."
        },
        {
          id: 8,
          question: "How long does account approval take?",
          answer: "Account approval typically takes 1-2 business days. During peak periods, it may take up to 3-5 business days. You'll receive email notifications about your application status throughout the process."
        }
      ]
    },
    {
      category: "Internship Management",
      icon: FileText,
      color: "bg-red-100 text-red-600",
      questions: [
        {
          id: 9,
          question: "How do I submit an internship request?",
          answer: "Navigate to the 'Requests' section, click 'New Request', and fill out the internship request form with trainee details, duration, preferred department, and description. Attach required documents and submit for review."
        },
        {
          id: 10,
          question: "What documents are required for internship requests?",
          answer: "Required documents include: institutional recommendation letter, academic transcripts, identity proof, medical fitness certificate (if applicable), and any specific departmental requirements. Check with your target department for additional requirements."
        },
        {
          id: 11,
          question: "How can I track my internship request status?",
          answer: "Log into TAMS and visit the 'Requests' dashboard. You'll see real-time status updates including submitted, under review, approved, mentor assigned, in progress, or completed. Email notifications are sent for major status changes."
        },
        {
          id: 12,
          question: "Can I modify an internship request after submission?",
          answer: "Requests can be modified only in 'Submitted' status before review begins. Once under review or approved, contact your L&D Coordinator for any necessary changes. Major modifications may require a new request."
        },
        {
          id: 13,
          question: "What happens after my internship request is approved?",
          answer: "After approval, a suitable mentor from your preferred department will be assigned. You'll receive mentor contact details and internship guidelines via email. The mentor will coordinate the start date and provide necessary orientation."
        }
      ]
    },
    {
      category: "Mentor Management",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      questions: [
        {
          id: 14,
          question: "How are mentors assigned to trainees?",
          answer: "TAMS uses an intelligent matching algorithm considering mentor expertise, current workload, availability, and departmental requirements. Department HoDs can also manually assign mentors based on specific project needs."
        },
        {
          id: 15,
          question: "Can I request a specific mentor?",
          answer: "While you can mention preferences in your request description, final mentor assignment depends on availability, workload, and departmental approval. The system prioritizes optimal matching for the best learning experience."
        },
        {
          id: 16,
          question: "What if I have issues with my assigned mentor?",
          answer: "Contact your Department HoD or L&D Coordinator immediately. They can facilitate communication, provide mediation, or reassign a different mentor if necessary. Your learning experience is our priority."
        },
        {
          id: 17,
          question: "How do I evaluate my mentor's guidance?",
          answer: "At internship completion, you'll receive an evaluation form to rate your mentor's guidance, support, and overall experience. This feedback helps improve the mentorship program and recognition of excellent mentors."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: Settings,
      color: "bg-orange-100 text-orange-600",
      questions: [
        {
          id: 18,
          question: "The system is running slowly. What should I do?",
          answer: "Clear your browser cache and cookies, ensure stable internet connection, and try refreshing the page. If issues persist, try a different browser or contact IT support with specific error details and your system information."
        },
        {
          id: 19,
          question: "I'm getting error messages. How can I resolve them?",
          answer: "Note the exact error message and steps that caused it. Try logging out and back in, clearing browser data, or using an incognito/private browsing window. Contact support with error screenshots for faster resolution."
        },
        {
          id: 20,
          question: "Can I use TAMS on mobile devices?",
          answer: "Yes, TAMS is responsive and works on smartphones and tablets. However, for the best experience and full functionality, we recommend using a desktop or laptop browser, especially for document uploads and detailed forms."
        },
        {
          id: 21,
          question: "Is there a mobile app for TAMS?",
          answer: "Currently, TAMS is available as a web application only. A dedicated mobile app is under development and will be announced soon. The web version is mobile-optimized for convenient access on the go."
        }
      ]
    }
  ]

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredQuestions = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

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
                  <h1 className="text-2xl font-bold text-gray-900">TAMS FAQ</h1>
                  <p className="text-sm text-gray-600">Frequently Asked Questions</p>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <HelpCircle className="h-3 w-3 mr-1" />
              Help Center
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about IOCL TAMS system
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-red-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {searchTerm && (
            <p className="mt-4 text-sm text-gray-500">
              Found {filteredQuestions.reduce((acc, cat) => acc + cat.questions.length, 0)} results for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">System Access</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                &lt;2hrs
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredQuestions.map((category) => (
            <Card key={category.category} className="border-red-100">
              <CardHeader>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                    <CardDescription>
                      {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="flex items-center justify-between w-full text-left py-2 hover:text-red-600 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      
                      {expandedItems.includes(faq.id) && (
                        <div className="mt-2 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {searchTerm && filteredQuestions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any FAQ matching "{searchTerm}". Try different keywords or browse categories above.
              </p>
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        <Card className="mt-12 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/user-guide">
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    View User Guide
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}