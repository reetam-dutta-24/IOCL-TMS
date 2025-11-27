"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Users,
  Building,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  Edit,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  AlertCircle,
  BarChart3,
  PieChart,
  Server,
  HardDrive,
  Cpu,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface User {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

interface ResourceMetrics {
  totalMentors: number;
  availableMentors: number;
  mentorUtilization: number;
  totalCapacity: number;
  usedCapacity: number;
  facilitiesUtilization: number;
  budgetAllocated: number;
  budgetUsed: number;
  equipmentAvailability: number;
}

interface MentorResource {
  id: number;
  name: string;
  department: string;
  currentLoad: number;
  maxCapacity: number;
  utilizationRate: number;
  specializations: string[];
  availability: "AVAILABLE" | "FULL" | "UNAVAILABLE";
  nextAvailable?: string;
}

interface FacilityResource {
  id: number;
  name: string;
  type: "LAB" | "CLASSROOM" | "CONFERENCE" | "EQUIPMENT";
  capacity: number;
  currentBookings: number;
  utilizationRate: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  department?: string;
  nextAvailable?: string;
}

interface BudgetAllocation {
  department: string;
  allocated: number;
  used: number;
  remaining: number;
  utilizationRate: number;
  programs: number;
}

interface ResourceRequest {
  id: number;
  type: "MENTOR" | "FACILITY" | "EQUIPMENT" | "BUDGET";
  requester: string;
  department: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedDate: string;
  requiredDate?: string;
  estimatedCost?: number;
}

export default function ResourceAllocationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resourceMetrics, setResourceMetrics] =
    useState<ResourceMetrics | null>(null);
  const [mentorResources, setMentorResources] = useState<MentorResource[]>([]);
  const [facilityResources, setFacilityResources] = useState<
    FacilityResource[]
  >([]);
  const [budgetAllocations, setBudgetAllocations] = useState<
    BudgetAllocation[]
  >([]);
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>(
    []
  );
  const [selectedRequest, setSelectedRequest] =
    useState<ResourceRequest | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Check authentication and L&D HoD role
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    // Check if user has L&D HoD privileges
    if (parsedUser.role !== "L&D HoD") {
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
    loadResourceData();
    setIsLoading(false);
  }, [router]);

  const loadResourceData = async () => {
    try {
      setIsRefreshing(true);

      // Simulate API calls with fallback data
      setResourceMetrics({
        totalMentors: 28,
        availableMentors: 8,
        mentorUtilization: 71.4,
        totalCapacity: 112,
        usedCapacity: 80,
        facilitiesUtilization: 67.3,
        budgetAllocated: 2500000,
        budgetUsed: 1875000,
        equipmentAvailability: 89.2,
      });

      setMentorResources([
        {
          id: 1,
          name: "Dr. Vikram Gupta",
          department: "Mechanical Engineering",
          currentLoad: 4,
          maxCapacity: 4,
          utilizationRate: 100,
          specializations: ["Industrial Design", "Manufacturing"],
          availability: "FULL",
          nextAvailable: "2024-03-15",
        },
        {
          id: 2,
          name: "Prof. Suresh Reddy",
          department: "Computer Science",
          currentLoad: 2,
          maxCapacity: 4,
          utilizationRate: 50,
          specializations: ["AI/ML", "Data Science"],
          availability: "AVAILABLE",
        },
        {
          id: 3,
          name: "Dr. Kavita Nair",
          department: "Chemical Engineering",
          currentLoad: 3,
          maxCapacity: 3,
          utilizationRate: 100,
          specializations: ["Process Optimization", "Quality Control"],
          availability: "FULL",
          nextAvailable: "2024-02-28",
        },
        {
          id: 4,
          name: "Prof. Rajesh Patel",
          department: "Electrical Engineering",
          currentLoad: 1,
          maxCapacity: 3,
          utilizationRate: 33,
          specializations: ["Power Systems", "Electronics"],
          availability: "AVAILABLE",
        },
      ]);

      setFacilityResources([
        {
          id: 1,
          name: "Advanced Manufacturing Lab",
          type: "LAB",
          capacity: 20,
          currentBookings: 18,
          utilizationRate: 90,
          status: "OCCUPIED",
          department: "Mechanical Engineering",
          nextAvailable: "2024-02-20",
        },
        {
          id: 2,
          name: "Computer Science Lab A",
          type: "LAB",
          capacity: 30,
          currentBookings: 15,
          utilizationRate: 50,
          status: "AVAILABLE",
          department: "Computer Science",
        },
        {
          id: 3,
          name: "Conference Room Alpha",
          type: "CONFERENCE",
          capacity: 25,
          currentBookings: 12,
          utilizationRate: 48,
          status: "AVAILABLE",
        },
        {
          id: 4,
          name: "Chemical Process Simulator",
          type: "EQUIPMENT",
          capacity: 1,
          currentBookings: 1,
          utilizationRate: 100,
          status: "OCCUPIED",
          department: "Chemical Engineering",
          nextAvailable: "2024-03-01",
        },
      ]);

      setBudgetAllocations([
        {
          department: "Computer Science",
          allocated: 600000,
          used: 420000,
          remaining: 180000,
          utilizationRate: 70,
          programs: 45,
        },
        {
          department: "Mechanical Engineering",
          allocated: 550000,
          used: 467500,
          remaining: 82500,
          utilizationRate: 85,
          programs: 38,
        },
        {
          department: "Electrical Engineering",
          allocated: 500000,
          used: 350000,
          remaining: 150000,
          utilizationRate: 70,
          programs: 32,
        },
        {
          department: "Chemical Engineering",
          allocated: 450000,
          used: 382500,
          remaining: 67500,
          utilizationRate: 85,
          programs: 25,
        },
        {
          department: "Civil Engineering",
          allocated: 400000,
          used: 280000,
          remaining: 120000,
          utilizationRate: 70,
          programs: 16,
        },
      ]);

      setResourceRequests([
        {
          id: 1,
          type: "MENTOR",
          requester: "Prof. Amit Sharma",
          department: "Computer Science",
          description:
            "Additional mentor needed for AI/ML specialization to handle increased internship requests",
          priority: "HIGH",
          status: "PENDING",
          requestedDate: new Date().toISOString(),
          requiredDate: "2024-03-01",
        },
        {
          id: 2,
          type: "FACILITY",
          requester: "Dr. Priya Singh",
          department: "Chemical Engineering",
          description:
            "Need access to advanced spectroscopy lab for research internship projects",
          priority: "MEDIUM",
          status: "PENDING",
          requestedDate: new Date(Date.now() - 86400000).toISOString(),
          requiredDate: "2024-02-25",
        },
        {
          id: 3,
          type: "EQUIPMENT",
          requester: "Prof. Ravi Kumar",
          department: "Mechanical Engineering",
          description:
            "3D printer for prototyping projects - current equipment at capacity",
          priority: "MEDIUM",
          status: "APPROVED",
          requestedDate: new Date(Date.now() - 172800000).toISOString(),
          estimatedCost: 150000,
        },
        {
          id: 4,
          type: "BUDGET",
          requester: "Dr. Neha Gupta",
          department: "Electrical Engineering",
          description:
            "Additional budget allocation for extended internship program duration",
          priority: "LOW",
          status: "PENDING",
          requestedDate: new Date(Date.now() - 259200000).toISOString(),
          estimatedCost: 75000,
        },
      ]);
    } catch (error) {
      console.error("Failed to load resource data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "FULL":
        return <Badge className="bg-red-100 text-red-800">Full</Badge>;
      case "UNAVAILABLE":
        return <Badge className="bg-gray-100 text-gray-800">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">{availability}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "OCCUPIED":
        return <Badge className="bg-red-100 text-red-800">Occupied</Badge>;
      case "MAINTENANCE":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
        );
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "MENTOR":
        return <Users className="h-4 w-4" />;
      case "FACILITY":
        return <Building className="h-4 w-4" />;
      case "EQUIPMENT":
        return <Server className="h-4 w-4" />;
      case "BUDGET":
        return <Target className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const filteredRequests = resourceRequests.filter((req) => {
    const typeMatch =
      filterType === "all" ||
      req.type.toLowerCase() === filterType.toLowerCase();
    const statusMatch =
      filterStatus === "all" ||
      req.status.toLowerCase() === filterStatus.toLowerCase();
    return typeMatch && statusMatch;
  });

  const utilizationData = budgetAllocations.map((dept) => ({
    department: dept.department.replace(" Engineering", ""),
    mentors: mentorResources.filter((m) => m.department === dept.department)
      .length,
    budget: dept.utilizationRate,
    programs: dept.programs,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading Resource Management Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Resource Allocation
            </h1>
            <p className="text-gray-600">
              Manage and optimize L&D resources, capacity, and budget allocation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
              <Target className="h-4 w-4 mr-2" />
              Resource Management
            </Badge>
            <Button
              onClick={loadResourceData}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Resource Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Mentor Utilization
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {resourceMetrics?.mentorUtilization || 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {resourceMetrics?.usedCapacity || 0}/
                    {resourceMetrics?.totalCapacity || 0} capacity
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <Progress
                  value={resourceMetrics?.mentorUtilization || 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Facility Utilization
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {resourceMetrics?.facilitiesUtilization || 0}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">
                      +5% from last week
                    </span>
                  </div>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress
                  value={resourceMetrics?.facilitiesUtilization || 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Budget Utilization
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {resourceMetrics
                      ? Math.round(
                          (resourceMetrics.budgetUsed /
                            resourceMetrics.budgetAllocated) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{((resourceMetrics?.budgetUsed || 0) / 100000).toFixed(1)}L
                    / ₹
                    {((resourceMetrics?.budgetAllocated || 0) / 100000).toFixed(
                      1
                    )}
                    L
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <Progress
                  value={
                    resourceMetrics
                      ? (resourceMetrics.budgetUsed /
                          resourceMetrics.budgetAllocated) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Equipment Availability
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {resourceMetrics?.equipmentAvailability || 0}%
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {
                      resourceRequests.filter(
                        (r) => r.type === "EQUIPMENT" && r.status === "PENDING"
                      ).length
                    }{" "}
                    pending requests
                  </p>
                </div>
                <Server className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Department Resource Utilization</CardTitle>
            <CardDescription>
              Resource allocation and usage across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mentors" fill="#3b82f6" name="Mentors" />
                  <Bar
                    dataKey="budget"
                    fill="#22c55e"
                    name="Budget Utilization %"
                  />
                  <Bar dataKey="programs" fill="#f59e0b" name="Programs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resource Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mentor Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Mentor Resources
              </CardTitle>
              <CardDescription>
                Current mentor capacity and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentorResources.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{mentor.name}</span>
                        {getAvailabilityBadge(mentor.availability)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {mentor.department}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Capacity</span>
                            <span>
                              {mentor.currentLoad}/{mentor.maxCapacity}
                            </span>
                          </div>
                          <Progress
                            value={mentor.utilizationRate}
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.specializations.map((spec, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facility Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Facility Resources
              </CardTitle>
              <CardDescription>
                Lab and facility utilization status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilityResources.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{facility.name}</span>
                        {getStatusBadge(facility.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {facility.type} • {facility.department || "Shared"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Utilization</span>
                            <span>
                              {facility.currentBookings}/{facility.capacity}
                            </span>
                          </div>
                          <Progress
                            value={facility.utilizationRate}
                            className="h-2"
                          />
                        </div>
                      </div>
                      {facility.nextAvailable && (
                        <p className="text-xs text-gray-500 mt-1">
                          Next available:{" "}
                          {new Date(
                            facility.nextAvailable
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Book
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Department</CardTitle>
            <CardDescription>
              Financial resource distribution and utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Programs</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetAllocations.map((budget, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{budget.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      ₹{(budget.allocated / 100000).toFixed(1)}L
                    </TableCell>
                    <TableCell>₹{(budget.used / 100000).toFixed(1)}L</TableCell>
                    <TableCell>
                      <span
                        className={
                          budget.remaining < budget.allocated * 0.2
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        ₹{(budget.remaining / 100000).toFixed(1)}L
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{budget.utilizationRate}%</span>
                        <Progress
                          value={budget.utilizationRate}
                          className="w-16 h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{budget.programs}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Resource Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resource Requests</CardTitle>
                <CardDescription>
                  Pending and recent resource allocation requests
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getResourceIcon(request.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">
                          {request.type} Request
                        </h4>
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        {request.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {request.requester}
                      </span>
                      <span className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {request.department}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(request.requestedDate).toLocaleDateString()}
                      </span>
                      {request.estimatedCost && (
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />₹
                          {(request.estimatedCost / 1000).toFixed(0)}K
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Optimization Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>
              AI-powered suggestions for resource optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Target className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Mentor Reallocation:</strong> Consider redistributing
                  mentors from Chemical Engineering (100% utilization) to
                  Computer Science (50% utilization) to balance workload.
                </AlertDescription>
              </Alert>
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <strong>Budget Alert:</strong> Mechanical Engineering
                  department is at 85% budget utilization. Consider reallocating
                  funds from under-utilized departments.
                </AlertDescription>
              </Alert>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Efficiency Gain:</strong> Conference Room Alpha is
                  underutilized (48%). This resource can accommodate additional
                  training sessions.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
