"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/forms/file-upload"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewRequestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Personal Information
    traineeName: "",
    traineeEmail: "",
    traineePhone: "",
    dateOfBirth: "",
    address: "",

    // Academic Information
    institution: "",
    course: "",
    year: "",
    cgpa: "",
    semester: "",

    // Internship Details
    department: "",
    duration: "",
    startDate: "",
    endDate: "",
    projectTitle: "",
    projectDescription: "",
    skills: "",

    // Additional Information
    previousExperience: "",
    expectations: "",
    documents: [] as File[],
  })

  const steps = [
    { id: 1, title: "Personal Information", description: "Basic personal details" },
    { id: 2, title: "Academic Information", description: "Educational background" },
    { id: 3, title: "Internship Details", description: "Project and duration details" },
    { id: 4, title: "Documents & Review", description: "Upload documents and review" },
  ]

  const departments = [
    "Information Technology",
    "Engineering",
    "Operations",
    "Research & Development",
    "Human Resources",
    "Finance",
    "Marketing",
    "Safety & Environment",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilesSelected = (files: File[]) => {
    setFormData((prev) => ({ ...prev, documents: files }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.traineeName && formData.traineeEmail && formData.traineePhone
      case 2:
        return formData.institution && formData.course && formData.year && formData.cgpa
      case 3:
        return (
          formData.department && formData.duration && formData.startDate && formData.endDate && formData.projectTitle
        )
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
      setError("")
    } else {
      setError("Please fill in all required fields")
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess(true)
      setTimeout(() => {
        router.push("/requests")
      }, 2000)
    } catch (err) {
      setError("Failed to submit request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-700 mb-2">Request Submitted Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your internship request has been submitted and is now under review. You will receive an email confirmation
            shortly.
          </p>
          <Link href="/requests">
            <Button className="bg-red-600 hover:bg-red-700">View All Requests</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/requests">
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-red-700">New Internship Request</h1>
            <p className="text-gray-600 mt-1">Submit your internship application</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep >= step.id ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? "text-red-700" : "text-gray-500"}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-red-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-red-700">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="traineeName">Full Name *</Label>
                  <Input
                    id="traineeName"
                    value={formData.traineeName}
                    onChange={(e) => handleInputChange("traineeName", e.target.value)}
                    placeholder="Enter your full name"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="traineeEmail">Email Address *</Label>
                  <Input
                    id="traineeEmail"
                    type="email"
                    value={formData.traineeEmail}
                    onChange={(e) => handleInputChange("traineeEmail", e.target.value)}
                    placeholder="Enter your email address"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="traineePhone">Phone Number *</Label>
                  <Input
                    id="traineePhone"
                    value={formData.traineePhone}
                    onChange={(e) => handleInputChange("traineePhone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your complete address"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    placeholder="Enter your institution name"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Program *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    placeholder="e.g., B.Tech Computer Science"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study *</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger className="border-orange-200">
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
                  <Label htmlFor="cgpa">CGPA/Percentage *</Label>
                  <Input
                    id="cgpa"
                    value={formData.cgpa}
                    onChange={(e) => handleInputChange("cgpa", e.target.value)}
                    placeholder="Enter your CGPA or percentage"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Input
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => handleInputChange("semester", e.target.value)}
                    placeholder="Enter current semester"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Internship Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange("department", value)}
                    >
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Month</SelectItem>
                        <SelectItem value="2">2 Months</SelectItem>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="4">4 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Preferred Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className="border-orange-200 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Expected End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className="border-orange-200 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                    placeholder="Enter your proposed project title"
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                    placeholder="Describe your proposed project in detail"
                    rows={4}
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Relevant Skills</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="List your relevant skills and technologies"
                    rows={3}
                    className="border-orange-200 focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Documents & Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-red-700">Upload Documents</h3>
                  <p className="text-sm text-gray-600">Please upload the following documents (PDF format preferred):</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Resume/CV</li>
                    <li>Academic transcripts</li>
                    <li>Cover letter</li>
                    <li>Any relevant certificates</li>
                  </ul>
                  <FileUpload
                    onFilesSelected={handleFilesSelected}
                    maxFiles={10}
                    acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-red-700">Additional Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="previousExperience">Previous Experience</Label>
                    <Textarea
                      id="previousExperience"
                      value={formData.previousExperience}
                      onChange={(e) => handleInputChange("previousExperience", e.target.value)}
                      placeholder="Describe any previous internships or relevant experience"
                      rows={3}
                      className="border-orange-200 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectations">Expectations from Internship</Label>
                    <Textarea
                      id="expectations"
                      value={formData.expectations}
                      onChange={(e) => handleInputChange("expectations", e.target.value)}
                      placeholder="What do you hope to learn and achieve during this internship?"
                      rows={3}
                      className="border-orange-200 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Review Summary */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-red-700 mb-3">Application Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {formData.traineeName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {formData.traineeEmail}
                    </div>
                    <div>
                      <span className="font-medium">Institution:</span> {formData.institution}
                    </div>
                    <div>
                      <span className="font-medium">Course:</span> {formData.course}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {formData.department}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {formData.duration} months
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span> {formData.startDate}
                    </div>
                    <div>
                      <span className="font-medium">Documents:</span> {formData.documents.length} files uploaded
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="bg-red-600 hover:bg-red-700">
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
