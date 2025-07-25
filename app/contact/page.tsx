"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Building,
  AlertCircle,
  Users
} from "lucide-react"

export default function ContactPage() {
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
                  <h1 className="text-2xl font-bold text-gray-900">Contact Support</h1>
                  <p className="text-sm text-gray-600">Get help with TAMS</p>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Headphones className="h-3 w-3 mr-1" />
              24/7 Support
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Information */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our support team is ready to help you with any questions or issues regarding IOCL TAMS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>Immediate assistance for urgent issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Primary Support Line</p>
                    <p className="text-red-600 font-semibold">+91-11-2338-9999</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Emergency IT Support</p>
                    <p className="text-red-600 font-semibold">+91-11-2338-8888</p>
                    <p className="text-sm text-gray-500">24/7 for critical issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-red-600" />
                  Email Support
                </CardTitle>
                <CardDescription>Detailed assistance and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">General Support</p>
                    <p className="text-red-600 font-semibold">tams@iocl.co.in</p>
                    <p className="text-sm text-gray-500">Response within 4 hours</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Technical Issues</p>
                    <p className="text-red-600 font-semibold">tams-tech@iocl.co.in</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Office Location
                </CardTitle>
                <CardDescription>Visit us for in-person support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">L&D Department</p>
                    <p className="text-gray-600">IndianOil Bhavan</p>
                    <p className="text-gray-600">G-9, Ali Yavar Jung Marg</p>
                    <p className="text-gray-600">Bandra (East), Mumbai - 400051</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Mon-Fri: 9:00 AM - 5:30 PM
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-red-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we will get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@iocl.co.in"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91-XXXXXXXXXX"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        placeholder="EMP001"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ld">Learning & Development</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category *</Label>
                    <Select>
                      <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Access Issues</SelectItem>
                        <SelectItem value="technical">Technical Problems</SelectItem>
                        <SelectItem value="requests">Internship Requests</SelectItem>
                        <SelectItem value="mentors">Mentor Assignment</SelectItem>
                        <SelectItem value="reports">Reports & Analytics</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select>
                      <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="medium">Medium - Non-urgent issue</SelectItem>
                        <SelectItem value="high">High - Affects daily work</SelectItem>
                        <SelectItem value="urgent">Urgent - System down/blocking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Provide detailed information about your issue, including any error messages, steps taken, and expected behavior..."
                      className="border-red-200 focus:border-red-500 focus:ring-red-500 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">For Faster Resolution:</h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Include specific error messages if any</li>
                          <li>• Mention your browser type and version</li>
                          <li>• Provide screenshots if applicable</li>
                          <li>• Include steps to reproduce the issue</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ and Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-blue-100">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">FAQ</h3>
              <p className="text-sm text-gray-600 mb-4">
                Find answers to common questions
              </p>
              <Link href="/faq">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600">
                  View FAQ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center border-green-100">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">User Guide</h3>
              <p className="text-sm text-gray-600 mb-4">
                Step-by-step instructions for using TAMS
              </p>
              <Link href="/user-guide">
                <Button variant="outline" size="sm" className="border-green-600 text-green-600">
                  View Guide
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-100">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">System Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check current system availability
              </p>
              <Button variant="outline" size="sm" className="border-purple-600 text-purple-600">
                Check Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Information */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Support Response Times
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">15min</div>
                  <div className="text-sm text-gray-600">Urgent Issues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">2hrs</div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">4hrs</div>
                  <div className="text-sm text-gray-600">Medium Priority</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">24hrs</div>
                  <div className="text-sm text-gray-600">General Inquiries</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}