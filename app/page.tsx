"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  Cloud, 
  BarChart3, 
  CheckCircle,
  Bell,
  Settings,
  Smartphone,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: CheckCircle,
      title: "Automated Approval Workflows",
      description: "Streamline the trainee approval process with customizable, multi-stage workflows."
    },
    {
      icon: Users,
      title: "Comprehensive Trainee Profiles",
      description: "Maintain detailed records of all trainees, their progress, and performance metrics."
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Securely store and manage all trainee-related documents and certifications."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Gain insights into trainee performance and program effectiveness with robust analytics."
    },
    {
      icon: Bell,
      title: "Automated Notifications",
      description: "Keep trainees, mentors, and administrators informed with timely alerts."
    },
    {
      icon: Settings,
      title: "Customizable Reporting",
      description: "Generate tailored reports for compliance audits and strategic planning."
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "Ensure data security and compliance with granular access permissions."
    },
    {
      icon: Cloud,
      title: "Cloud-Based Accessibility",
      description: "Access TAMS securely from anywhere, on any device."
    }
  ]

  const capabilities = [
    {
      icon: Cloud,
      title: "Cloud-Native Architecture",
      description: "Built on a scalable and secure cloud infrastructure for high availability and performance."
    },
    {
      icon: Award,
      title: "AI-Powered Analytics",
      description: "Utilize artificial intelligence for predictive insights and optimized trainee pathways."
    },
    {
      icon: Settings,
      title: "Seamless Integrations",
      description: "Connect seamlessly with existing HRs, LMSs, and other enterprise systems."
    },
    {
      icon: Smartphone,
      title: "Multi-Platform Access",
      description: "Available on web and dedicated mobile applications for on-the-go management."
    }
  ]

  const stats = [
    { number: "5000+", label: "Total Trainees" },
    { number: "150+", label: "Active Programs" },
    { number: "95%", label: "Completion Rate" }
  ]

  const testimonials = [
    {
      quote: "TAMS has revolutionized our trainee management. The efficiency gains are remarkable, and the data analytics provide invaluable insights for our strategic planning.",
      author: "Dr. Anjali Sharma",
      position: "Chief HoD L&D, IOCL"
    },
    {
      quote: "The intuitive interface and robust features of TAMS have made our training program administration seamless. A truly enterprise-grade solution.",
      author: "Mr. Rajesh Kumar",
      position: "Training Head, Operational Official, IOCL"
    },
    {
      quote: "Compliance and reporting are critical for us. TAMS provides all the tools we need to ensure adherence to regulatory and operational standards with ease.",
      author: "Ms. Priya Singh",
      position: "Compliance Head, Operations Official, IOCL"
    }
  ]

  const departments = [
    "HR Department",
    "Training & Development", 
    "Operations Division",
    "Compliance & Legal",
    "IT Services"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="tams-gradient shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-10 w-10 text-white" />
              <div className="text-white">
                <h1 className="text-2xl font-bold">IOCL TAMS</h1>
                <p className="text-sm opacity-90">Indian Oil Corporation Limited</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white hover:text-red-100 transition-colors">Features</a>
              <a href="#capabilities" className="text-white hover:text-red-100 transition-colors">Capabilities</a>
              <a href="#contact" className="text-white hover:text-red-100 transition-colors">Contact</a>
              <Link href="/login">
                <Button variant="secondary" className="bg-white text-red-600 hover:bg-red-50">
                  Access Dashboard
                </Button>
              </Link>
            </nav>
            <Button variant="secondary" className="md:hidden bg-white text-red-600">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="tams-gradient-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Trainee<br />
            Management with TAMS
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The comprehensive solution for efficient trainee approval, tracking, and development at IOCL.
          </p>
          <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
            TAMS empowers IOCL to optimize its trainee programs, ensuring compliance, enhancing learning outcomes, and fostering a skilled workforce for the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                Login to Dashboard
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3">
                Request System Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features of TAMS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to streamline every aspect of trainee management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-red-100">
                <CardContent className="p-6">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Authority */}
      <section className="tams-section-bg py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trust & Authority</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {departments.map((dept, index) => (
              <span key={index} className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                {dept}
              </span>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md border border-red-100">
                <div className="text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Leaders Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-red-100">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.position}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Capabilities */}
      <section id="capabilities" className="tams-section-bg py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Capabilities Overview</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-red-100">
                <CardContent className="p-6">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <capability.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600 text-sm">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="tams-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-8 w-8" />
                <span className="text-xl font-bold">IOCL TAMS</span>
              </div>
              <p className="text-red-100">
                Streamlining trainee management for India's energy future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-red-100">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-red-100">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Support Helpline: +91-12345/6789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email: support@iocl.co.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Corporate Office: New Delhi, India</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-red-100">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-400 mt-8 pt-8 text-center text-red-100">
            <p>© 2024 IOCL TAMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
