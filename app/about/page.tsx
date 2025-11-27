"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { 
  ArrowLeft, 
  Target, 
  Users, 
  Award, 
  CheckCircle,
  Lightbulb,
  Shield,
  Zap,
  Globe,
  Building,
  BookOpen,
  ArrowRight
} from "lucide-react"

export default function AboutPage() {
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
                  <h1 className="text-2xl font-bold text-gray-900">About TAMS</h1>
                  <p className="text-sm text-gray-600">Learn more about our platform</p>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <Building className="h-3 w-3 mr-1" />
              IOCL Initiative
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transforming Training Management at IOCL
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            IOCL TAMS (Trainee Approval & Management System) is a cutting-edge digital platform 
            developed to revolutionize how we manage internships, training programs, and mentor 
            assignments across all Indian Oil Corporation Limited departments.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-red-100">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To streamline and enhance the training experience for both mentors and trainees by 
                providing a comprehensive, user-friendly platform that automates processes, improves 
                communication, and ensures the highest quality of professional development across IOCL.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To become the gold standard for training management systems in the energy sector, 
                fostering innovation, excellence, and continuous learning while contributing to 
                India's energy security and sustainable development goals.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose TAMS?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-red-100">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Automated Workflows</CardTitle>
                <CardDescription>
                  Streamlined processes that reduce manual work and increase efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Digital request processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automated approvals
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Smart notifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-red-100">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Intelligent Matching</CardTitle>
                <CardDescription>
                  AI-powered mentor-trainee pairing based on skills and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Skill-based matching
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Workload balancing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Performance tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-red-100">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-grade security with role-based access and data protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Encrypted data storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Role-based permissions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Audit trail logging
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                TAMS by the Numbers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">1,250+</div>
                  <div className="text-gray-700">Trainees Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">180+</div>
                  <div className="text-gray-700">Active Mentors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">95%</div>
                  <div className="text-gray-700">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">12</div>
                  <div className="text-gray-700">Departments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team & Development */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Built for IOCL, by IOCL
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-red-600" />
                  Development Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  TAMS was developed by IOCL's internal IT and L&D teams in collaboration with 
                  experienced software engineers who understand the unique needs of the energy sector.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    L&D Department Subject Matter Experts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    IT Infrastructure Specialists
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    User Experience Designers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Security and Compliance Experts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-red-600" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Built using modern, reliable technologies to ensure scalability, 
                  performance, and long-term maintainability.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Next.js for responsive web application
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    PostgreSQL for robust data storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Advanced security protocols
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Cloud-ready infrastructure
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Future Enhancements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2 text-blue-900">Mobile App</h4>
                  <p className="text-sm text-blue-700">
                    Native mobile applications for iOS and Android platforms
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2 text-blue-900">AI Integration</h4>
                  <p className="text-sm text-blue-700">
                    Advanced AI for predictive analytics and smart recommendations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2 text-blue-900">Integration Hub</h4>
                  <p className="text-sm text-blue-700">
                    Seamless integration with existing IOCL systems and tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="py-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of IOCL employees who are already using TAMS to streamline 
                their training and mentorship activities. Request access today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Request Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/user-guide">
                  <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View User Guide
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}