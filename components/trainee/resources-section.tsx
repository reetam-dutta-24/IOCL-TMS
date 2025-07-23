"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, Search, FileText, Video, Link, Presentation, FileCode, ExternalLink, Calendar } from "lucide-react"
import { ResourceType } from "@/types"

interface Resource {
  id: number
  title: string
  description?: string
  resourceType: ResourceType
  content?: string
  filePath?: string
  fileName?: string
  department?: string
  isActive: boolean
  createdAt: string
  tags?: string[]
  downloadCount?: number
}

interface ResourcesSectionProps {
  departmentId?: number
}

export function ResourcesSection({ departmentId }: ResourcesSectionProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<ResourceType | "ALL">("ALL")

  useEffect(() => {
    loadResources()
  }, [departmentId])

  const loadResources = async () => {
    try {
      // Mock data for demonstration
      const mockResources: Resource[] = [
        {
          id: 1,
          title: "IOCL Employee Handbook",
          description: "Comprehensive guide to company policies, procedures, and culture",
          resourceType: "DOCUMENT",
          fileName: "employee_handbook.pdf",
          department: "Human Resources",
          isActive: true,
          createdAt: "2024-01-01T10:00:00Z",
          tags: ["HR", "Policies", "Onboarding"],
          downloadCount: 245
        },
        {
          id: 2,
          title: "React.js Fundamentals Course",
          description: "Complete video series covering React basics to advanced concepts",
          resourceType: "VIDEO",
          content: "https://example.com/react-course",
          department: "Information Technology",
          isActive: true,
          createdAt: "2024-01-05T14:30:00Z",
          tags: ["React", "JavaScript", "Frontend"],
          downloadCount: 89
        },
        {
          id: 3,
          title: "Database Design Best Practices",
          description: "Guidelines for designing efficient and scalable database schemas",
          resourceType: "PRESENTATION",
          fileName: "db_design_best_practices.pptx",
          department: "Information Technology",
          isActive: true,
          createdAt: "2024-01-10T09:15:00Z",
          tags: ["Database", "Design", "Best Practices"],
          downloadCount: 156
        },
        {
          id: 4,
          title: "API Documentation Standards",
          description: "Documentation standards and examples for RESTful APIs",
          resourceType: "LINK",
          content: "https://api-docs.iocl.internal/standards",
          department: "Information Technology",
          isActive: true,
          createdAt: "2024-01-12T11:20:00Z",
          tags: ["API", "Documentation", "Standards"],
          downloadCount: 72
        },
        {
          id: 5,
          title: "Safety Procedures Manual",
          description: "Complete safety guidelines and emergency procedures",
          resourceType: "DOCUMENT",
          fileName: "safety_manual.pdf",
          department: "Operations",
          isActive: true,
          createdAt: "2024-01-08T16:45:00Z",
          tags: ["Safety", "Emergency", "Procedures"],
          downloadCount: 198
        },
        {
          id: 6,
          title: "Git and Version Control Tutorial",
          description: "Interactive tutorial for Git basics and collaborative development",
          resourceType: "TUTORIAL",
          content: "https://git-tutorial.iocl.internal",
          department: "Information Technology",
          isActive: true,
          createdAt: "2024-01-15T13:30:00Z",
          tags: ["Git", "Version Control", "Tutorial"],
          downloadCount: 134
        },
        {
          id: 7,
          title: "Project Management Templates",
          description: "Collection of project management templates and checklists",
          resourceType: "DOCUMENT",
          fileName: "pm_templates.zip",
          department: "Learning & Development",
          isActive: true,
          createdAt: "2024-01-18T08:00:00Z",
          tags: ["Project Management", "Templates", "Planning"],
          downloadCount: 67
        },
        {
          id: 8,
          title: "Communication Skills Workshop",
          description: "Video workshop on effective workplace communication",
          resourceType: "VIDEO",
          content: "https://training.iocl.internal/communication",
          department: "Learning & Development",
          isActive: true,
          createdAt: "2024-01-20T10:30:00Z",
          tags: ["Communication", "Soft Skills", "Workshop"],
          downloadCount: 203
        }
      ]
      setResources(mockResources)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load resources:", error)
      setLoading(false)
    }
  }

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "DOCUMENT":
        return <FileText className="h-4 w-4" />
      case "VIDEO":
        return <Video className="h-4 w-4" />
      case "LINK":
        return <Link className="h-4 w-4" />
      case "PRESENTATION":
        return <Presentation className="h-4 w-4" />
      case "TUTORIAL":
        return <FileCode className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getResourceColor = (type: ResourceType) => {
    switch (type) {
      case "DOCUMENT":
        return "bg-blue-100 text-blue-800"
      case "VIDEO":
        return "bg-red-100 text-red-800"
      case "LINK":
        return "bg-green-100 text-green-800"
      case "PRESENTATION":
        return "bg-orange-100 text-orange-800"
      case "TUTORIAL":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleResourceAccess = (resource: Resource) => {
    if (resource.resourceType === "LINK" || resource.resourceType === "VIDEO" || resource.resourceType === "TUTORIAL") {
      window.open(resource.content, '_blank')
    } else {
      // In real implementation, this would trigger file download
      console.log(`Downloading ${resource.fileName}`)
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === "ALL" || resource.resourceType === selectedType
    
    return matchesSearch && matchesType && resource.isActive
  })

  const resourceTypes: Array<{ value: ResourceType | "ALL", label: string }> = [
    { value: "ALL", label: "All Types" },
    { value: "DOCUMENT", label: "Documents" },
    { value: "VIDEO", label: "Videos" },
    { value: "PRESENTATION", label: "Presentations" },
    { value: "TUTORIAL", label: "Tutorials" },
    { value: "LINK", label: "Links" }
  ]

  if (loading) {
    return <div>Loading resources...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Learning Resources</h3>
        <p className="text-sm text-gray-600">Access training materials, documentation, and learning content</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ResourceType | "ALL")}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {resourceTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Categories */}
      <div className="grid gap-1 grid-cols-2 sm:grid-cols-5">
        {resourceTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className="justify-start"
          >
            {type.value !== "ALL" && getResourceIcon(type.value as ResourceType)}
            <span className="ml-2">{type.label}</span>
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getResourceIcon(resource.resourceType)}
                  <CardTitle className="text-base line-clamp-2">{resource.title}</CardTitle>
                </div>
                <Badge className={getResourceColor(resource.resourceType)} variant="secondary">
                  {resource.resourceType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{resource.department}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {resource.tags && (
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {resource.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{resource.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  {resource.downloadCount} downloads
                </span>
                <Button
                  size="sm"
                  onClick={() => handleResourceAccess(resource)}
                  className="flex items-center gap-1"
                >
                  {resource.resourceType === "LINK" || 
                   resource.resourceType === "VIDEO" || 
                   resource.resourceType === "TUTORIAL" ? (
                    <>
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedType !== "ALL" 
              ? "Try adjusting your search or filter criteria"
              : "No learning resources are currently available"
            }
          </p>
          {(searchTerm || selectedType !== "ALL") && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setSelectedType("ALL")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {filteredResources.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredResources.length} of {resources.length} resources
        </div>
      )}
    </div>
  )
}