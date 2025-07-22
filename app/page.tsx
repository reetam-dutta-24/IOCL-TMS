"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { 
  Users, 
  FileText, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Clock,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Download,
  MessageCircle,
  Headphones,
  Info,
  HelpCircle,
  BookOpen,
  Zap,
  Star,
  Building
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({
    totalInterns: 0,
    activeMentors: 0,
    completedPrograms: 0,
    departments: 0
  })

  useEffect(() => {
    // Animate stats on load
    const animateStats = () => {
      const finalStats = {
        totalInterns: 1250,
        activeMentors: 180,
        completedPrograms: 95,
        departments: 12
      }

      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      Object.keys(finalStats).forEach((key) => {
        const finalValue = finalStats[key as keyof typeof finalStats]
        const increment = finalValue / steps

        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            setStats(prev => ({
              ...prev,
              [key]: Math.round(increment * i)
            }))
          }, stepDuration * i)
        }
      })
    }

    animateStats()
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/#features" },
    { name: "User Guide", href: "/user-guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <div className="min-h-screen">
      {/* Enhanced Navigation with Links */}
      <nav className="bg-white shadow-sm border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <IndianOilLogo width={40} height={40} className="mr-3" />
              <div>
                <div className="font-bold text-xl text-gray-900">IOCL TAMS</div>
                <div className="text-xs text-gray-600">Trainee Approval & Management System</div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-red-600 hover:text-red-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Request Access
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-gray-600 hover:text-red-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full text-red-600 hover:text-red-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Request Access
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="tams-gradient-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-red-100 text-red-800 mb-4">
              Streamlined Training Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="text-red-600">IOCL TAMS</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive Trainee Approval & Management System designed to streamline 
              internship processes, mentor assignments, and training program management 
              across all IOCL departments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/user-guide">
                <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.totalInterns}+</div>
              <div className="text-gray-600">Total Interns</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.activeMentors}+</div>
              <div className="text-gray-600">Active Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.completedPrograms}%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.departments}</div>
              <div className="text-gray-600">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage training programs efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Request Management</CardTitle>
                <CardDescription>
                  Streamlined internship request processing with automated workflows and approval chains.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Digital request submission
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multi-level approval workflow
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time status tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Mentor Assignment</CardTitle>
                <CardDescription>
                  Intelligent mentor-trainee matching based on expertise, availability, and departmental needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automated matching algorithm
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

            <Card className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>
                  Comprehensive insights and analytics to optimize training programs and mentor effectiveness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Performance dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom report generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Data-driven insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Fixed White Button Text */}
      <section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Training Management?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join IOCL TAMS today and experience the future of streamlined 
            training and mentorship management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 font-semibold">
                Request System Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700 hover:border-red-100">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Working Links */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <IndianOilLogo width={32} height={32} className="mr-3" />
                <div>
                  <div className="font-bold text-xl">IOCL TAMS</div>
                  <div className="text-sm text-gray-400">Trainee Approval & Management System</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering IOCL's training programs through intelligent automation, 
                streamlined workflows, and comprehensive management tools.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">www.iocl.com</span>
              </div>
              <div className="flex space-x-4">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2" />
                    Request Access
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2" />
                    About TAMS
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2" />
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Help & Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/user-guide" className="hover:text-white transition-colors flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors flex items-center">
                    <Headphones className="h-4 w-4 mr-2" />
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <div>+91-11-2338-9999</div>
                    <div className="text-xs">Mon-Fri, 9AM-6PM</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <div>tams@iocl.co.in</div>
                    <div className="text-xs">Support Email</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <div>IndianOil Bhavan</div>
                    <div>New Delhi - 110001</div>
                  </div>
                </li>
                <li className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>L&D Department</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Indian Oil Corporation Limited. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <Badge className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  System Online
                </Badge>
                <div className="flex items-center text-gray-400 text-sm">
                  <Star className="h-4 w-4 mr-1" />
                  <span>v2.1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}