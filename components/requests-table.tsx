import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit } from "lucide-react"

export function RequestsTable() {
  const requests = [
    {
      id: "REQ001",
      traineeName: "Arjun Reddy",
      institution: "IIT Delhi",
      department: "IT",
      status: "SUBMITTED",
      submittedDate: "2024-01-15",
    },
    {
      id: "REQ002",
      traineeName: "Sneha Agarwal",
      institution: "NIT Trichy",
      department: "IT",
      status: "UNDER_REVIEW",
      submittedDate: "2024-01-14",
    },
    {
      id: "REQ003",
      traineeName: "Rohit Sharma",
      institution: "BITS Pilani",
      department: "Engineering",
      status: "APPROVED",
      submittedDate: "2024-01-12",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { variant: "secondary" as const, label: "Submitted" },
      UNDER_REVIEW: { variant: "default" as const, label: "Under Review" },
      APPROVED: { variant: "default" as const, label: "Approved" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["SUBMITTED"]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Trainee</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.id}</TableCell>
              <TableCell>{request.traineeName}</TableCell>
              <TableCell>{request.institution}</TableCell>
              <TableCell>{request.department}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
