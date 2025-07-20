"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Request {
  id: number
  requestNumber: string
  traineeName: string
  institutionName: string
  status: string
  createdAt: string
  submitter: {
    firstName: string
    lastName: string
  }
}

export function RequestsTable() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/internships?limit=5")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
      // Fallback to mock data
      setRequests([
        {
          id: 1,
          requestNumber: "IOCL-INT-2024-0001",
          traineeName: "Arjun Reddy",
          institutionName: "IIT Delhi",
          status: "SUBMITTED",
          createdAt: "2024-01-15T10:30:00Z",
          submitter: { firstName: "Priya", lastName: "Sharma" },
        },
        {
          id: 2,
          requestNumber: "IOCL-INT-2024-0002",
          traineeName: "Sneha Agarwal",
          institutionName: "NIT Trichy",
          status: "UNDER_REVIEW",
          createdAt: "2024-01-14T14:20:00Z",
          submitter: { firstName: "Priya", lastName: "Sharma" },
        },
        {
          id: 3,
          requestNumber: "IOCL-INT-2024-0003",
          traineeName: "Rohit Sharma",
          institutionName: "BITS Pilani",
          status: "APPROVED",
          createdAt: "2024-01-12T09:15:00Z",
          submitter: { firstName: "Rajesh", lastName: "Kumar" },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { className: "bg-blue-100 text-blue-800", label: "Submitted" },
      UNDER_REVIEW: { className: "bg-yellow-100 text-yellow-800", label: "Under Review" },
      APPROVED: { className: "bg-green-100 text-green-800", label: "Approved" },
      REJECTED: { className: "bg-red-100 text-red-800", label: "Rejected" },
      IN_PROGRESS: { className: "bg-purple-100 text-purple-800", label: "In Progress" },
      COMPLETED: { className: "bg-gray-100 text-gray-800", label: "Completed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SUBMITTED
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border border-orange-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request #</TableHead>
            <TableHead>Trainee</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium text-red-700">{request.requestNumber}</TableCell>
              <TableCell>{request.traineeName}</TableCell>
              <TableCell>{request.institutionName}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
