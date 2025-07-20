import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  FileText,
  ArrowRight,
  Shield,
  BarChart3,
  Bell,
  Settings,
  Cloud,
  Zap,
  Lock,
  Globe,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Menu,
  Search,
  User,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: CheckCircle,
      title: "Automated Approval Workflows",
      description: "Streamline the trainee approval process with customizable, multi-stage workflows",
    },
    {
      icon: Users,
      title: "Comprehensive Trainee Profiles",
      description: "Maintain detailed trainee profiles with progress and performance tracking",
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Centralized repository for trainee-related documents and certifications",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Monitor and analyze trainee program effectiveness with robust analytics",
    },
    {
      icon: Bell,
      title: "Automated Notifications",
      description: "Keep all stakeholders informed with timely alerts and notifications",
    },
    {
      icon: Settings,
      title: "Customizable Reporting",
      description: "Generate comprehensive reports for audits and strategic planning",
    },
    {
      icon: Lock,
      title: "Role-Based Access Control",
      description: "Ensure data security and privacy with granular access permissions",
    },
    {
      icon: Cloud,
      title: "Cloud-Based Accessibility",
      description: "Access TAMS securely from anywhere, on any device",
    },
  ]

  const capabilities = [
    {
      icon: Cloud,
      title: "Cloud-Native Architecture",
      description: "Built on a scalable and secure cloud infrastructure for high availability and performance",
    },
    {
      icon: BarChart3,
      title: "AI-Powered Analytics",
      description: "Leverage advanced analytics for predictive insights and optimized trainee pathways",
    },
    {
      icon: Zap,
      title: "Seamless Integrations",
      description: "Connect effortlessly with existing HRMs, LMS, and other enterprise systems",
    },
    {
      icon: Globe,
      title: "Multi-Platform Access",
      description: "Available via web browsers and dedicated mobile applications for on-the-go access",
    },
    {
      icon: Shield,
      title: "Robust Disaster Recovery",
      description: "Comprehensive backup and disaster recovery ensures data integrity and business continuity",
    },
    {
      icon: Lock,
      title: "Enterprise-Grade Security",
      description: "Advanced security measures to protect sensitive trainee data and ensure compliance",
    },
  ]

  const testimonials = [
    {
      name: "Dr. Anjali Sharma",
      role: "Head of HR, IOCL",
      content:
        "TAMS has revolutionized our trainee management. The efficiency gains are remarkable, and the data insights are invaluable for our strategic planning.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Mr. Rajesh Kumar",
      role: "Training Manager",
      content:
        "The intuitive interface and robust features of TAMS have made our training program administration seamless. A truly enterprise-grade solution.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Ms. Priya Singh",
      role: "Compliance Officer, IOCL",
      content:
        "Compliance and reporting are critical for us. TAMS provides all the tools we need to ensure adherence to regulations with ease.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const departments = [
    "HR Department",
    "Training & Development",
    "Operations Division",
    "Compliance & Legal",
    "IT Services",
  ]

  const stats = [
    { value: "5000+", label: "Total Trainees" },
    { value: "150+", label: "Active Programs" },
    { value: "95%", label: "Completion Rate" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-coral-500 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-coral-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">IOCL TAMS</h1>
                <p className="text-xs text-coral-100">Trainee Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#home" className="hover:text-coral-200 transition-colors">
                HOME
              </Link>
              <Link href="#features" className="hover:text-coral-200 transition-colors">
                FEATURES
              </Link>
              <Link href="#about" className="hover:text-coral-200 transition-colors">
                ABOUT US
              </Link>
              <Link href="#contact" className="hover:text-coral-200 transition-colors">
                CONTACT
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-coral-200 hidden md:block" />
              <User className="h-5 w-5 text-coral-200 hidden md:block" />
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-coral-500 bg-transparent"
                  >
                    Login to Dashboard
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-coral-500 hover:bg-coral-50">Request System Access</Button>
                </Link>
              </div>
              <Menu className="h-6 w-6 md:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-coral-500 to-coral-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Streamline Trainee
              <br />
              Management with TAMS
            </h1>
            <p className="text-xl text-coral-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              The comprehensive solution for efficient trainee approval, tracking, and development at IOCL.
            </p>
            <p className="text-lg text-coral-200 mb-10 max-w-2xl mx-auto">
              TAMS empowers IOCL to optimize its trainee programs, ensuring compliance, enhancing learning outcomes, and
              fostering a skilled workforce for the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-coral-500 hover:bg-coral-50 px-8 py-3 text-lg">
                  Login to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-coral-500 bg-transparent px-8 py-3 text-lg"
                >
                  Request System Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features of TAMS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to streamline every aspect of trainee management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-coral-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-coral-500" />
                  </div>
                  <CardTitle className="text-coral-700 text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Authority Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trust & Authority</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {departments.map((dept, index) => (
              <Badge key={index} variant="secondary" className="bg-coral-100 text-coral-700 px-4 py-2 text-sm">
                {dept}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-coral-500 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Capabilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Capabilities Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on enterprise-grade infrastructure with advanced features for modern trainee management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="border-coral-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center mb-4">
                    <capability.icon className="h-6 w-6 text-coral-500" />
                  </div>
                  <CardTitle className="text-coral-700">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{capability.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Trusted by IOCL professionals across departments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-coral-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-coral-100 text-coral-700">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral-500 to-coral-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Trainee Management?</h2>
            <p className="text-xl text-coral-100 mb-8">
              Join IOCL's digital transformation journey and experience the power of streamlined trainee management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-coral-500 hover:bg-coral-50 px-8 py-3 text-lg">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-coral-500 bg-transparent px-8 py-3 text-lg"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-coral-500 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">IOCL TAMS</span>
              </div>
              <p className="text-gray-400 mb-4">
                Comprehensive trainee management system for Indian Oil Corporation Limited.
              </p>
              <div className="flex space-x-4">
                <Shield className="h-5 w-5 text-gray-400" />
                <CheckCircle className="h-5 w-5 text-gray-400" />
                <Globe className="h-5 w-5 text-gray-400" />
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Support Hotline: +91-11-23456789</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Email: support@iocl.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Corporate Office: New Delhi, India</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IOCL TAMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
