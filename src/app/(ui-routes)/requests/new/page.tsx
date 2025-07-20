"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FileUpload } from "@/components/forms/file-upload"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"

const requestSchema = z.object({
  traineeName: z.string().min(2, "Trainee name must be at least 2 characters"),
  traineeEmail: z.string().email("Please enter a valid email address"),
  traineePhone: z.string().min(10, "Please enter a valid phone number"),
  institutionName: z.string().min(2, "Institution name is required"),
  courseDetails: z.string().min(2, "Course details are required"),
  internshipDuration: z.number().min(30, "Minimum duration is 30 days").max(180, "Maximum duration is 180 days"),
  preferredDepartment: z.string().min(1, "Please select a department"),
  requestDescription: z.string().min(10, "Please provide a detailed description"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

export default function NewRequestPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    traineeName: "",
    traineeEmail: "",
    traineePhone: "",
    institutionName: "",
    courseDetails: "",
    internshipDuration: 60,
    preferredDepartment: "",
    requestDescription: "",
    priority: "MEDIUM" as const,
  })

  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [departments, setDepartments] = useState([
    { id: "1", name: "Information Technology", code: "IT" },
    { id: "2", name: "Engineering", code: "ENG" },
    { id: "3", name: "Operations", code: "OPS" },
    { id: "4", name: "Research & Development", code: "R&D" },
    { id: "5", name: "Human Resources", code: "HR" },
  ])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const validateStep = (step: number) => {
    const stepErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.traineeName.trim()) stepErrors.traineeName = "Trainee name is required"
      if (!formData.traineeEmail.trim()) stepErrors.traineeEmail = "Email is required"
      if (!formData.traineePhone.trim()) stepErrors.traineePhone = "Phone number is required"
      if (!formData.institutionName.trim()) stepErrors.institutionName = "Institution name is required"
    }

    if (step === 2) {
      if (!formData.courseDetails.trim()) stepErrors.courseDetails = "Course details are required"
      if (!formData.preferredDepartment) stepErrors.preferredDepartment = "Department selection is required"
      if (formData.internshipDuration < 30 || formData.internshipDuration > 180) {
        stepErrors.internshipDuration = "Duration must be between 30-180 days"
      }
    }

    if (step === 3) {
      if (!formData.requestDescription.trim()) stepErrors.requestDescription = "Description is required"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setLoading(true)
    try {
      // Validate entire form
      const validatedData = requestSchema.parse({
        ...formData,
        preferredDepartment: Number.parseInt(formData.preferredDepartment),
      })

      // Create FormData for file uploads
      const submitData = new FormData()
      Object.entries(validatedData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })

      // Add attachments
      attachments.forEach((file, index) => {
        submitData.append(`attachment_${index}`, file)
      })

      const response = await fetch("/api/internships", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      const result = await response.json()

      toast({
        title: "Request Submitted Successfully!",
        description: `Your request ${result.data.requestNumber} has been submitted for review.`,
      })

      router.push("/requests")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your request. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Trainee Information", description: "Basic trainee details" },
    { number: 2, title: "Internship Details", description: "Course and department info" },
    { number: 3, title: "Description & Priority", description: "Request details" },
    { number: 4, title: "Review & Submit", description: "Final review" },
  ]

  const progressPercentage = (currentStep / steps.length) * 100

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Internship Request</h1>
            <p className="text-gray-600">Submit a new internship request for review</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center text-center ${
                      step.number <= currentStep ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.number <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.number < currentStep ? <CheckCircle className="h-4 w-4" /> : step.number}
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-medium">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Trainee Information */}
            {currentStep === 1 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="traineeName">Trainee Full Name *</Label>
                  <Input
                    id="traineeName"
                    value={formData.traineeName}
                    onChange={(e) => handleInputChange("traineeName", e.target.value)}
                    placeholder="Enter trainee's full name"
                    className={errors.traineeName ? "border-red-500" : ""}
                  />
                  {errors.traineeName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.traineeName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traineeEmail">Email Address *</Label>
                  <Input
                    id="traineeEmail"
                    type="email"
                    value={formData.traineeEmail}
                    onChange={(e) => handleInputChange("traineeEmail", e.target.value)}
                    placeholder="trainee@institution.edu"
                    className={errors.traineeEmail ? "border-red-500" : ""}
                  />
                  {errors.traineeEmail && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.traineeEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traineePhone">Phone Number *</Label>
                  <Input
                    id="traineePhone"
                    value={formData.traineePhone}
                    onChange={(e) => handleInputChange("traineePhone", e.target.value)}
                    placeholder="+91-9876543210"
                    className={errors.traineePhone ? "border-red-500" : ""}
                  />
                  {errors.traineePhone && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.traineePhone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange("institutionName", e.target.value)}
                    placeholder="e.g., IIT Delhi, NIT Trichy"
                    className={errors.institutionName ? "border-red-500" : ""}
                  />
                  {errors.institutionName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.institutionName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Internship Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="courseDetails">Course Details *</Label>
                  <Input
                    id="courseDetails"
                    value={formData.courseDetails}
                    onChange={(e) => handleInputChange("courseDetails", e.target.value)}
                    placeholder="e.g., Computer Science Engineering, Mechanical Engineering"
                    className={errors.courseDetails ? "border-red-500" : ""}
                  />
                  {errors.courseDetails && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.courseDetails}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDepartment">Preferred Department *</Label>
                    <Select
                      value={formData.preferredDepartment}
                      onValueChange={(value) => handleInputChange("preferredDepartment", value)}
                    >
                      <SelectTrigger className={errors.preferredDepartment ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.preferredDepartment && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.preferredDepartment}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internshipDuration">Duration (Days) *</Label>
                    <Input
                      id="internshipDuration"
                      type="number"
                      min="30"
                      max="180"
                      value={formData.internshipDuration}
                      onChange={(e) => handleInputChange("internshipDuration", Number.parseInt(e.target.value))}
                      className={errors.internshipDuration ? "border-red-500" : ""}
                    />
                    {errors.internshipDuration && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.internshipDuration}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">Duration must be between 30-180 days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Description & Priority */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requestDescription">Request Description *</Label>
                  <Textarea
                    id="requestDescription"
                    value={formData.requestDescription}
                    onChange={(e) => handleInputChange("requestDescription", e.target.value)}
                    placeholder="Provide detailed information about the internship requirements, objectives, and any specific skills or areas of focus..."
                    rows={6}
                    className={errors.requestDescription ? "border-red-500" : ""}
                  />
                  {errors.requestDescription && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.requestDescription}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">{formData.requestDescription.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Low Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="HIGH">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          High Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Supporting Documents</Label>
                  <FileUpload
                    onFilesSelected={handleFileUpload}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                    acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                  />

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Attached Files:</Label>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please review all information before submitting. Once submitted, the request will be automatically
                    routed to the L&D department for initial review.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trainee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <strong>Name:</strong> {formData.traineeName}
                      </div>
                      <div>
                        <strong>Email:</strong> {formData.traineeEmail}
                      </div>
                      <div>
                        <strong>Phone:</strong> {formData.traineePhone}
                      </div>
                      <div>
                        <strong>Institution:</strong> {formData.institutionName}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Internship Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <strong>Course:</strong> {formData.courseDetails}
                      </div>
                      <div>
                        <strong>Department:</strong>{" "}
                        {departments.find((d) => d.id === formData.preferredDepartment)?.name}
                      </div>
                      <div>
                        <strong>Duration:</strong> {formData.internshipDuration} days
                      </div>
                      <div>
                        <strong>Priority:</strong>
                        <Badge
                          variant={
                            formData.priority === "HIGH"
                              ? "destructive"
                              : formData.priority === "MEDIUM"
                                ? "default"
                                : "secondary"
                          }
                          className="ml-2"
                        >
                          {formData.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{formData.requestDescription}</p>
                  </CardContent>
                </Card>

                {attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Attachments ({attachments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="iocl-button-primary">
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="iocl-button-primary">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
