"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { IndianOilLogo } from "@/components/ui/logo"
import { PageLoading } from "@/components/ui/page-loading"
import { SectionLoading } from "@/components/ui/loading"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Info,
  HelpCircle,
  BookOpen,
  Zap,
  Star,
  Building,
  BarChart3,
  Calendar,
  UserCheck,
  Target,
  Database,
  Search,
  Bell,
  Settings,
  Lock,
  Workflow,
  Filter,
  PieChart,
  AlertCircle,
  CheckSquare,
  UserPlus,
  GraduationCap,
  ClipboardList,
  Activity,
  Loader2,
  Send,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface ApprovedTrainee {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  institutionName: string
  courseName: string
  currentYear: number
  cgpa: number
  preferredDepartment: string
  internshipDuration: number
  skills?: string
  projectInterests?: string
  status: string
  createdAt: string
  approvedAt: string
}

interface Department {
  id: number
  name: string
  code: string
}

export default function LandingPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sectionsLoading, setSectionsLoading] = useState({
    hero: true,
    stats: true,
    features: true,
    cta: true,
    footer: true
  })
  const [stats, setStats] = useState({
    totalInterns: 0,
    activeMentors: 0,
    completedPrograms: 0,
    departments: 0
  })

  // Send Request Dialog State
  const [isSendRequestOpen, setIsSendRequestOpen] = useState(false)
  const [approvedTrainees, setApprovedTrainees] = useState<ApprovedTrainee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    // Simulate page loading
    const pageLoadTimer = setTimeout(() => {
      setIsLoading(false)
      
      // Stagger section loading for smooth effect
      setTimeout(() => setSectionsLoading(prev => ({ ...prev, hero: false })), 200)
      setTimeout(() => setSectionsLoading(prev => ({ ...prev, stats: false })), 400)
      setTimeout(() => setSectionsLoading(prev => ({ ...prev, features: false })), 600)
      setTimeout(() => setSectionsLoading(prev => ({ ...prev, cta: false })), 800)
      setTimeout(() => setSectionsLoading(prev => ({ ...prev, footer: false })), 1000)
    }, 1500)

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
          }, stepDuration * i + 2000) // Start after page loads
        }
      })
    }

    animateStats()

    return () => clearTimeout(pageLoadTimer)
  }, [])

  // Send Request Functions
  const loadSendRequestData = async () => {
    setIsLoadingData(true)
    try {
      const [traineesRes, departmentsRes] = await Promise.all([
        fetch("/api/department-hod/approved-trainees"),
        fetch("/api/department")
      ])

      if (traineesRes.ok) {
        const traineesData = await traineesRes.json()
        setApprovedTrainees(traineesData.approvedTrainees || [])
      }

      if (departmentsRes.ok) {
        const departmentsData = await departmentsRes.json()
        setDepartments(departmentsData)
      }
    } catch (error) {
      console.error("Failed to load send request data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleTraineeSelection = (traineeId: number) => {
    setSelectedTrainees(prev =>
      prev.includes(traineeId)
        ? prev.filter(id => id !== traineeId)
        : [...prev, traineeId]
    )
  }

  const handleSelectAllTrainees = () => {
    const filteredTrainees = getFilteredTrainees()
    setSelectedTrainees(filteredTrainees.map(t => t.id))
  }

  const handleDeselectAllTrainees = () => {
    setSelectedTrainees([])
  }

  const getFilteredTrainees = () => {
    return approvedTrainees.filter(trainee => {
      const matchesSearch = searchTerm === "" ||
        trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = filterDepartment === "all" ||
        trainee.preferredDepartment === filterDepartment

      return matchesSearch && matchesDepartment
    })
  }

  const handleSendRequest = async () => {
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to send")
      return
    }

    if (!selectedDepartment) {
      toast.error("Please select a department")
      return
    }

    setIsProcessing(true)
    try {
      const selectedTraineeData = approvedTrainees.filter(t => selectedTrainees.includes(t.id))

      const response = await fetch("/api/notifications/forward-to-lnd-hod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: selectedDepartment,
          applications: selectedTraineeData
        })
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      const result = await response.json()
      toast.success(`✅ Successfully sent ${selectedTrainees.length} trainee details to LND HOD`)

      // Reset selections
      setSelectedTrainees([])
      setSelectedDepartment("")
      setIsSendRequestOpen(false)

    } catch (error) {
      console.error("Error sending request:", error)
      toast.error("Failed to send request. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredTrainees = getFilteredTrainees()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/#features" },
    { name: "User Guide", href: "/user-guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ]

  const allFeatures = [
    {
      icon: FileText,
      title: "Internship Request Management",
      description: "Streamlined digital submission and processing of internship requests with automated workflows.",
      features: ["Digital request forms", "Document upload", "Status tracking", "Automated notifications"],
      category: "Core"
    },
    {
      icon: Users,
      title: "Mentor Assignment System",
      description: "Intelligent matching of mentors with trainees based on expertise, availability, and department needs.",
      features: ["Smart matching algorithm", "Workload balancing", "Performance tracking", "Feedback system"],
      category: "Core"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reporting",
      description: "Comprehensive insights and data-driven analytics for training program optimization.",
      features: ["Performance dashboards", "Custom reports", "Trend analysis", "Export capabilities"],
      category: "Analytics"
    },
    {
      icon: UserCheck,
      title: "User Management",
      description: "Complete user lifecycle management with role-based access control and permissions.",
      features: ["Role-based access", "User profiles", "Permission management", "Activity logs"],
      category: "Administration"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with audit trails and compliance management.",
      features: ["Data encryption", "Audit trails", "Compliance reporting", "Access logs"],
      category: "Security"
    },
    {
      icon: Calendar,
      title: "Training Scheduling",
      description: "Automated scheduling and calendar management for training sessions and meetings.",
      features: ["Calendar integration", "Automated scheduling", "Conflict resolution", "Reminders"],
      category: "Scheduling"
    },
    {
      icon: BarChart3,
      title: "Performance Monitoring",
      description: "Real-time monitoring of trainee progress and mentor effectiveness.",
      features: ["Progress tracking", "Performance metrics", "Goal setting", "Achievement badges"],
      category: "Analytics"
    },
    {
      icon: Database,
      title: "Document Management",
      description: "Centralized document repository with version control and secure access.",
      features: ["Document storage", "Version control", "Access permissions", "Search functionality"],
      category: "Management"
    },
    {
      icon: Bell,
      title: "Notification System",
      description: "Smart notification system keeping all stakeholders informed and engaged.",
      features: ["Real-time alerts", "Email notifications", "Push notifications", "Custom preferences"],
      category: "Communication"
    },
    {
      icon: Search,
      title: "Advanced Search & Filters",
      description: "Powerful search capabilities with advanced filtering and sorting options.",
      features: ["Global search", "Advanced filters", "Saved searches", "Export results"],
      category: "Utility"
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Automated workflows reducing manual tasks and improving efficiency.",
      features: ["Process automation", "Approval chains", "Task assignment", "Deadline management"],
      category: "Automation"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Comprehensive goal setting and tracking system for trainees and mentors.",
      features: ["SMART goals", "Progress milestones", "Achievement tracking", "Performance reviews"],
      category: "Performance"
    }
  ]

  if (isLoading) {
    return <PageLoading message="Loading TAMS Portal..." />
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Enhanced Navigation with Animations */}
      <nav className="bg-white shadow-sm border-b border-red-100 sticky top-0 z-50 animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Now Clickable */}
            <div className="flex items-center animate-slide-in-left">
              <IndianOilLogo width={40} height={40} className="mr-3 animate-float" clickable={true} />
              <div>
                <div className="font-bold text-xl text-gray-900">IOCL TAMS</div>
                <div className="text-xs text-gray-600">Trainee Approval & Management System</div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link text-gray-600 hover:text-red-600 font-medium transition-colors animate-slide-in-down animate-delay-${(index + 2) * 100}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4 animate-slide-in-right">
              <Link href="/login">
                <Button variant="ghost" className="btn-animate text-red-600 hover:text-red-700 hover-lift">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-animate bg-red-600 hover:bg-red-700 text-white hover-lift hover-glow">
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
                className="text-gray-600 hover-scale"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden animate-slide-in-down">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-gray-600 hover:text-red-600 font-medium hover-lift"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 btn-animate">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white btn-animate">
                      Request Access
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Loading */}
      <section className="tams-gradient-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionsLoading.hero ? (
            <SectionLoading />
          ) : (
            <div className="text-center animate-fade-in">
              <Badge className="bg-red-100 text-red-800 mb-4 animate-bounce-custom">
                Streamlined Training Management
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-in-up animate-delay-200">
                Welcome to{" "}
                <span className="text-red-600 hover-glow">IOCL TAMS</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-in-up animate-delay-400">
                A comprehensive Trainee Approval & Management System designed to streamline 
                internship processes, mentor assignments, and training program management 
                across all IOCL departments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up animate-delay-600">
                <Link href="/register">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white btn-animate hover-lift hover-glow">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/internship-apply">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold btn-animate hover-lift hover-scale">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Apply for Internship
                  </Button>
                </Link>
                <Link href="/user-guide">
                  <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 btn-animate hover-lift">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section with Loading */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionsLoading.stats ? (
            <SectionLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center animate-scale-in animate-delay-200">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.totalInterns}+</div>
                <div className="text-gray-600">Total Interns</div>
              </div>
              <div className="text-center animate-scale-in animate-delay-400">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.activeMentors}+</div>
                <div className="text-gray-600">Active Mentors</div>
              </div>
              <div className="text-center animate-scale-in animate-delay-600">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.completedPrograms}%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center animate-scale-in animate-delay-800">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.departments}+</div>
                <div className="text-gray-600">Departments</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section with Loading */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionsLoading.features ? (
            <SectionLoading />
          ) : (
            <>
              <div className="text-center mb-16 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Powerful Features for Modern Training Management
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  IOCL TAMS provides comprehensive tools and features to streamline your training 
                  and mentorship programs with advanced automation and analytics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allFeatures.map((feature, index) => (
                  <Card key={index} className={`hover:shadow-lg transition-all duration-300 hover-lift animate-slide-in-up animate-delay-${(index % 3) * 200 + 200}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-red-600" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section with Updated Button Color */}
      <section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {sectionsLoading.cta ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
              <span className="text-white">Loading...</span>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-in-up">
                Ready to Transform Your Training Management?
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto animate-slide-in-up animate-delay-200">
                Join IOCL TAMS today and experience the future of streamlined 
                training and mentorship management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up animate-delay-400">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 font-semibold btn-animate hover-lift hover-scale">
                    Request System Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/internship-apply">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold btn-animate hover-lift hover-scale">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Apply for Internship
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-white text-red-600 bg-red-600 hover:bg-red-700 hover:border-red-100 hover:text-white btn-animate hover-lift">
                    Access Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Footer with Removed Technical Support */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionsLoading.footer ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
              <span className="text-white">Loading footer...</span>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Company Info */}
                <div className="col-span-2 animate-slide-in-left">
                  <div className="flex items-center mb-4">
                    <IndianOilLogo width={32} height={32} className="mr-3 animate-float" clickable={true} />
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
                    <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="animate-slide-in-up animate-delay-200">
                  <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>
                      <Link href="/login" className="hover:text-white transition-colors flex items-center hover-lift">
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link href="/register" className="hover:text-white transition-colors flex items-center hover-lift">
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Request Access
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-white transition-colors flex items-center hover-lift">
                        <ArrowRight className="h-3 w-3 mr-2" />
                        About TAMS
                      </Link>
                    </li>
                    <li>
                      <Link href="/#features" className="hover:text-white transition-colors flex items-center hover-lift">
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Features
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Help & Support - Technical Support Removed */}
                <div className="animate-slide-in-up animate-delay-400">
                  <h3 className="font-semibold mb-4 text-white">Help & Support</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>
                      <Link href="/user-guide" className="hover:text-white transition-colors flex items-center hover-lift">
                        <BookOpen className="h-4 w-4 mr-2" />
                        User Guide
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="hover:text-white transition-colors flex items-center hover-lift">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Dialog open={isSendRequestOpen} onOpenChange={setIsSendRequestOpen}>
                        <DialogTrigger asChild>
                          <button 
                            onClick={() => {
                              setIsSendRequestOpen(true)
                              loadSendRequestData()
                            }}
                            className="hover:text-white transition-colors flex items-center hover-lift text-gray-400"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Request
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Send className="h-5 w-5 mr-2" />
                              Send Trainee Request to LND HOD
                            </DialogTitle>
                            <DialogDescription>
                              Select approved trainees and send their details to LND HOD for review and department assignment
                            </DialogDescription>
                          </DialogHeader>

                          {isLoadingData ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin mr-2" />
                              <span>Loading approved trainees...</span>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Filters */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Search Trainees</Label>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type="text"
                                      placeholder="Search by name, email, or institution..."
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      className="pl-10"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Filter by Department</Label>
                                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="All departments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Departments</SelectItem>
                                      {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.name}>
                                          {dept.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Target Department</Label>
                                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select department to send to" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.name}>
                                          {dept.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Trainees Table */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">Approved Trainees ({filteredTrainees.length})</h3>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={handleSelectAllTrainees}
                                    >
                                      Select All
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={handleDeselectAllTrainees}
                                    >
                                      Deselect All
                                    </Button>
                                  </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-12">
                                          <input
                                            type="checkbox"
                                            checked={selectedTrainees.length === filteredTrainees.length && filteredTrainees.length > 0}
                                            onChange={() =>
                                              selectedTrainees.length === filteredTrainees.length
                                                ? handleDeselectAllTrainees()
                                                : handleSelectAllTrainees()
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                          />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {filteredTrainees.map((trainee) => (
                                        <TableRow key={trainee.id}>
                                          <TableCell>
                                            <input
                                              type="checkbox"
                                              checked={selectedTrainees.includes(trainee.id)}
                                              onChange={() => handleTraineeSelection(trainee.id)}
                                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <div>
                                              <div className="font-medium">{trainee.firstName} {trainee.lastName}</div>
                                              <div className="text-sm text-gray-500">{trainee.phone}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>{trainee.email}</TableCell>
                                          <TableCell>
                                            <div>
                                              <div className="font-medium">{trainee.institutionName}</div>
                                              <div className="text-sm text-gray-500">Year {trainee.currentYear}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <div>
                                              <div className="font-medium">{trainee.courseName}</div>
                                              <div className="text-sm text-gray-500">CGPA: {trainee.cgpa}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline">
                                              {departments.find(d => d.id.toString() === trainee.preferredDepartment)?.name || 'Unknown'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {getStatusBadge(trainee.status)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Send Request Section */}
                              {selectedTrainees.length > 0 && (
                                <Alert className="border-blue-200 bg-blue-50">
                                  <Send className="h-4 w-4 text-blue-600" />
                                  <AlertDescription className="text-blue-700">
                                    You have selected {selectedTrainees.length} trainee(s) to send to {selectedDepartment || "selected department"}
                                  </AlertDescription>
                                </Alert>
                              )}

                              {/* Action Buttons */}
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsSendRequestOpen(false)}
                                  disabled={isProcessing}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSendRequest}
                                  disabled={!selectedDepartment || selectedTrainees.length === 0 || isProcessing}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {isProcessing ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send to LND HOD
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="animate-slide-in-right animate-delay-600">
                  <h3 className="font-semibold mb-4 text-white">Contact Info</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-start hover-lift">
                      <Phone className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <div>+91-11-2338-9999</div>
                        <div className="text-xs">Mon-Fri, 9AM-6PM</div>
                      </div>
                    </li>
                    <li className="flex items-start hover-lift">
                      <Mail className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <div>tams@iocl.co.in</div>
                        <div className="text-xs">Support Email</div>
                      </div>
                    </li>
                    <li className="flex items-start hover-lift">
                      <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <div>IndianOil Bhavan</div>
                        <div>New Delhi - 110001</div>
                      </div>
                    </li>
                    <li className="flex items-center hover-lift">
                      <Building className="h-4 w-4 mr-2" />
                      <span>L&D Department</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="border-t border-gray-800 mt-12 pt-8 animate-slide-in-up animate-delay-800">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-sm">
                    © 2024 Indian Oil Corporation Limited. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <Badge className="bg-green-100 text-green-800 animate-pulse">
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
          )}
        </div>
      </footer>
    </div>
  )
}