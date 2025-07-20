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
    {
      id: "REQ004",
      traineeName: "Priya Mishra",
      institution: "IISC Bangalore",
      department: "Operations",
      status: "APPROVED",
      submittedDate: "2024-01-10",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { 
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", 
        label: "Submitted" 
      },
      UNDER_REVIEW: { 
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200", 
        label: "Under Review" 
      },
      APPROVED: { 
        className: "bg-green-100 text-green-800 hover:bg-green-200", 
        label: "Approved" 
      },
      REJECTED: { 
        className: "bg-red-100 text-red-800 hover:bg-red-200", 
        label: "Rejected" 
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["SUBMITTED"]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="rounded-md border border-red-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-red-50">
          <TableRow className="hover:bg-red-100">
            <TableHead className="font-semibold text-red-900">Request ID</TableHead>
            <TableHead className="font-semibold text-red-900">Trainee</TableHead>
            <TableHead className="font-semibold text-red-900">Institution</TableHead>
            <TableHead className="font-semibold text-red-900">Department</TableHead>
            <TableHead className="font-semibold text-red-900">Status</TableHead>
            <TableHead className="font-semibold text-red-900">Date</TableHead>
            <TableHead className="text-right font-semibold text-red-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="hover:bg-red-50 transition-colors">
              <TableCell className="font-medium text-gray-900">{request.id}</TableCell>
              <TableCell className="text-gray-700">{request.traineeName}</TableCell>
              <TableCell className="text-gray-700">{request.institution}</TableCell>
              <TableCell className="text-gray-700">{request.department}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-gray-600">{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
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
