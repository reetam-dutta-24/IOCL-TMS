"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IndianOilLogo } from "@/components/ui/logo"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, GraduationCap, Calendar, Building, User, Mail, Phone, FileText } from "lucide-react"

export default function InternshipApplyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institutionName: "",
    courseName: "",
    currentYear: "",
    cgpa: "",
    preferredDepartment: "",
    internshipDuration: "",
    startDate: "",
    endDate: "",
    skills: "",
    projectInterests: "",
    motivation: "",
    resume: null as File | null,
    coverLetter: null as File | null
  })

  const handleChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError("")
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    const requiredFields = ["firstName", "lastName", "email", "phone", "institutionName", "courseName", "currentYear", "preferredDepartment", "internshipDuration", "startDate", "endDate", "motivation"]
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`)
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number")
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === "resume" || key === "coverLetter") {
          if (formData[key as keyof typeof formData]) {
            formDataToSend.append(key, formData[key as keyof typeof formData] as File)
          }
        } else {
          formDataToSend.append(key, formData[key as keyof typeof formData] as string)
        }
      })

      const response = await fetch("/api/internship-applications", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(data.error || "Failed to submit internship application")
      }
    } catch (error) {
      console.error("Application error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl space-y-6">
        {/* Back to Home */}
        <div className="animate-slide-in-down">
          <Button 
            asChild 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all"
          >
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Logo and Title */}
        <div className="text-center animate-scale-in animate-delay-200">
          <div className="flex justify-center mb-4">
            <IndianOilLogo width={60} height={60} className="animate-float" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Internship Application</h1>
          <p className="text-gray-600">Apply for internship opportunities at Indian Oil Corporation Limited</p>
        </div>

        {/* Application Form */}
        <Card className="animate-slide-in-up animate-delay-400 hover-lift border-red-100">
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert className="border-red-200 bg-red-50 animate-shake">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4 animate-fade-in animate-delay-700">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
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
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4 animate-fade-in animate-delay-900">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Academic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution/University *</Label>
                      <Input
                        id="institutionName"
                        placeholder="Enter institution name"
                        value={formData.institutionName}
                        onChange={(e) => handleChange("institutionName", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course/Program *</Label>
                      <Input
                        id="courseName"
                        placeholder="e.g., Computer Science Engineering"
                        value={formData.courseName}
                        onChange={(e) => handleChange("courseName", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentYear">Current Year *</Label>
                      <Select
                        value={formData.currentYear}
                        onValueChange={(value) => handleChange("currentYear", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:border-red-300">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA (Optional)</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="e.g., 8.5"
                        value={formData.cgpa}
                        onChange={(e) => handleChange("cgpa", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredDepartment">Preferred Department *</Label>
                      <Select
                        value={formData.preferredDepartment}
                        onValueChange={(value) => handleChange("preferredDepartment", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:border-red-300">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">Information Technology</SelectItem>
                          <SelectItem value="ENG">Engineering</SelectItem>
                          <SelectItem value="OPS">Operations</SelectItem>
                          <SelectItem value="FIN">Finance</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="LD">Learning & Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Internship Details */}
                <div className="space-y-4 animate-fade-in animate-delay-1100">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Internship Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="internshipDuration">Duration (weeks) *</Label>
                      <Select
                        value={formData.internshipDuration}
                        onValueChange={(value) => handleChange("internshipDuration", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:border-red-300">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 weeks</SelectItem>
                          <SelectItem value="6">6 weeks</SelectItem>
                          <SelectItem value="8">8 weeks</SelectItem>
                          <SelectItem value="12">12 weeks</SelectItem>
                          <SelectItem value="16">16 weeks</SelectItem>
                          <SelectItem value="20">20 weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Preferred Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Expected End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Skills and Interests */}
                <div className="space-y-4 animate-fade-in animate-delay-1300">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Skills & Project Interests
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Technical Skills (Optional)</Label>
                      <Textarea
                        id="skills"
                        placeholder="List your technical skills (e.g., Python, Java, React, Data Analysis, etc.)"
                        value={formData.skills}
                        onChange={(e) => handleChange("skills", e.target.value)}
                        className="min-h-[80px] transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectInterests">Project Interests (Optional)</Label>
                      <Textarea
                        id="projectInterests"
                        placeholder="Describe the type of projects you're interested in working on during your internship"
                        value={formData.projectInterests}
                        onChange={(e) => handleChange("projectInterests", e.target.value)}
                        className="min-h-[80px] transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-4 animate-fade-in animate-delay-1500">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Motivation & Goals
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Why do you want to intern at IOCL? *</Label>
                    <Textarea
                      id="motivation"
                      placeholder="Explain your motivation for applying to IOCL and what you hope to learn during your internship"
                      value={formData.motivation}
                      onChange={(e) => handleChange("motivation", e.target.value)}
                      className="min-h-[100px] transition-all duration-300 focus:scale-[1.02] hover:border-red-300"
                      disabled={isLoading}
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4 animate-fade-in animate-delay-1700">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Documents (Optional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume/CV (PDF)</Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange("resume", e.target.files?.[0] || null)}
                        className="transition-all duration-300 hover:border-red-300"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter (PDF)</Label>
                      <Input
                        id="coverLetter"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange("coverLetter", e.target.files?.[0] || null)}
                        className="transition-all duration-300 hover:border-red-300"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 transition-all animate-fade-in animate-delay-1900 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Application Submitted Successfully!</h3>
                <p className="text-gray-600">
                  Thank you for your interest in interning at IOCL. Your application has been received and is under review.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 mb-4">
                  <h4 className="font-semibold text-blue-900">What happens next?</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>• Your application will be reviewed by our team</p>
                    <p>• You'll receive an email confirmation within 24 hours</p>
                    <p>• If selected, you'll be contacted for further steps</p>
                    <p>• You can track your application status via email</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/">Return to Home</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                    <Link href="/internship-apply">Submit Another Application</Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center animate-fade-in animate-delay-2000">
              <p className="text-sm text-gray-600">
                Have questions?{" "}
                <a 
                  href="mailto:internships@iocl.co.in" 
                  className="text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
                >
                  Contact our internship team
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="animate-slide-in-up animate-delay-2100 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Internship Opportunities</h3>
            <p className="text-sm text-blue-700 mb-3">
              IOCL offers diverse internship opportunities across various departments. 
              Our internships provide hands-on experience in the energy sector and 
              exposure to real-world projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
              <div>
                <h4 className="font-semibold mb-1">Available Departments:</h4>
                <ul className="space-y-1">
                  <li>• Information Technology</li>
                  <li>• Engineering</li>
                  <li>• Operations</li>
                  <li>• Finance</li>
                  <li>• Human Resources</li>
                  <li>• Learning & Development</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Benefits:</h4>
                <ul className="space-y-1">
                  <li>• Mentorship from industry experts</li>
                  <li>• Real project experience</li>
                  <li>• Networking opportunities</li>
                  <li>• Potential full-time offers</li>
                  <li>• Certificate of completion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 