"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
  Award,
  ArrowRight,
  Plus,
  Eye,
  BookOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Cell,
} from "recharts";
import Link from "next/link";

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalMentors: number;
  activeMentors: number;
  totalUsers: number;
  activeUsers: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status: string;
  department: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  departmentBreakdown: { department: string; count: number }[];
  monthlyTrends: { month: string; count: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Simulate role-based dashboard data
      const mockData = generateRoleBasedData(user?.role);
      setDashboardData(mockData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const generateRoleBasedData = (role: string): DashboardData => {
    // Base data structure
    const baseStats: DashboardStats = {
      totalRequests: 45,
      pendingRequests: 12,
      approvedRequests: 28,
      rejectedRequests: 5,
      totalMentors: 15,
      activeMentors: 12,
      totalUsers: 150,
      activeUsers: 134
    };

    const baseActivities: RecentActivity[] = [
      {
        id: 1,
        type: "request",
        title: "New Internship Request",
        description: "Submitted by engineering department",
        user: "Rahul Sharma",
        timestamp: "2 hours ago",
        status: "pending",
        department: "Engineering"
      },
      {
        id: 2,
        type: "approval",
        title: "Request Approved",
        description: "Internship request approved by L&D HoD",
        user: "Priya Singh",
        timestamp: "4 hours ago",
        status: "approved",
        department: "HR"
      }
    ];

    // Customize data based on role
    switch (role) {
      case 'L&D Coordinator':
        return {
          stats: baseStats,
          recentActivities: baseActivities.filter(a => 
            ['request', 'assignment', 'status_update'].includes(a.type)
          ),
          departmentBreakdown: [
            { department: 'Engineering', count: 15 },
            { department: 'HR', count: 8 },
            { department: 'Finance', count: 12 },
            { department: 'Operations', count: 10 }
          ],
          monthlyTrends: [
            { month: 'Jan', count: 12 },
            { month: 'Feb', count: 18 },
            { month: 'Mar', count: 15 }
          ]
        };

      case 'L&D HoD':
        return {
          stats: {
            ...baseStats,
            totalRequests: 85,
            pendingRequests: 20
          },
          recentActivities: baseActivities,
          departmentBreakdown: [
            { department: 'Engineering', count: 25 },
            { department: 'HR', count: 18 },
            { department: 'Finance', count: 22 },
            { department: 'Operations', count: 20 }
          ],
          monthlyTrends: [
            { month: 'Jan', count: 22 },
            { month: 'Feb', count: 28 },
            { month: 'Mar', count: 35 }
          ]
        };

      case 'Department HoD':
        // Department HoDs see only their department data
        return {
          stats: {
            ...baseStats,
            totalRequests: 18,
            pendingRequests: 5,
            totalMentors: 8,
            activeMentors: 6
          },
          recentActivities: baseActivities.filter(a => 
            a.department === user?.department
          ),
          departmentBreakdown: [
            { department: user?.department || 'Your Department', count: 18 }
          ],
          monthlyTrends: [
            { month: 'Jan', count: 5 },
            { month: 'Feb', count: 8 },
            { month: 'Mar', count: 5 }
          ]
        };

      case 'Mentor':
        // Mentors see limited data relevant to their assignments
        return {
          stats: {
            totalRequests: 6,
            pendingRequests: 2,
            approvedRequests: 4,
            rejectedRequests: 0,
            totalMentors: 1,
            activeMentors: 1,
            totalUsers: 6,
            activeUsers: 6
          },
          recentActivities: baseActivities.filter(a => 
            a.type === 'assignment' || a.user === user?.firstName + ' ' + user?.lastName
          ),
          departmentBreakdown: [
            { department: 'My Assignments', count: 6 }
          ],
          monthlyTrends: [
            { month: 'Jan', count: 2 },
            { month: 'Feb', count: 3 },
            { month: 'Mar', count: 1 }
          ]
        };

      default:
        return {
          stats: baseStats,
          recentActivities: baseActivities,
          departmentBreakdown: [
            { department: 'Engineering', count: 15 },
            { department: 'HR', count: 8 },
            { department: 'Finance', count: 12 },
            { department: 'Operations', count: 10 }
          ],
          monthlyTrends: [
            { month: 'Jan', count: 12 },
            { month: 'Feb', count: 18 },
            { month: 'Mar', count: 15 }
          ]
        };
    }
  };



  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getQuickActions = () => {
    const actions = [];

    // Role-based quick actions
    switch (user?.role) {
      case 'L&D Coordinator':
        actions.push(
          {
            title: "Process Requests",
            description: "Review pending internship requests",
            href: "/requests",
            icon: FileText,
            color: "bg-blue-500",
          },
          {
            title: "Assign Mentors",
            description: "Match mentors with trainees",
            href: "/mentors",
            icon: Users,
            color: "bg-green-500",
          },
          {
            title: "Track Progress",
            description: "Monitor training progress",
            href: "/reports",
            icon: TrendingUp,
            color: "bg-purple-500",
          }
        );
        break;

      case 'L&D HoD':
        actions.push(
          {
            title: "Admin Panel",
            description: "Manage access requests",
            href: "/admin",
            icon: Users,
            color: "bg-red-500",
          },
          {
            title: "Approve Requests",
            description: "Final approval of requests",
            href: "/requests",
            icon: CheckCircle,
            color: "bg-green-500",
          },
          {
            title: "System Reports",
            description: "Generate executive reports",
            href: "/reports",
            icon: TrendingUp,
            color: "bg-purple-500",
          }
        );
        break;

      case 'Department HoD':
        actions.push(
          {
            title: "Department Requests",
            description: "Requests for your department",
            href: "/requests",
            icon: FileText,
            color: "bg-blue-500",
          },
          {
            title: "My Mentors",
            description: "Mentors in your department",
            href: "/mentors",
            icon: Users,
            color: "bg-green-500",
          },
          {
            title: "Department Reports",
            description: "Department performance",
            href: "/reports",
            icon: Building,
            color: "bg-orange-500",
          }
        );
        break;

      case 'Mentor':
        actions.push(
          {
            title: "My Assignments",
            description: "View assigned trainees",
            href: "/requests",
            icon: Users,
            color: "bg-green-500",
          },
          {
            title: "Submit Reports",
            description: "Submit progress reports",
            href: "/reports",
            icon: FileText,
            color: "bg-blue-500",
          },
          {
            title: "Training Materials",
            description: "Access training resources",
            href: "/user-guide",
            icon: BookOpen,
            color: "bg-purple-500",
          }
        );
        break;

      default:
        actions.push(
          {
            title: "View Requests",
            description: "Browse internship requests",
            href: "/requests",
            icon: FileText,
            color: "bg-blue-500",
          },
          {
            title: "Browse Mentors",
            description: "View mentor profiles",
            href: "/mentors",
            icon: Users,
            color: "bg-green-500",
          },
          {
            title: "Reports",
            description: "View available reports",
            href: "/reports",
            icon: TrendingUp,
            color: "bg-purple-500",
          }
        );
    }

    return actions;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { color: "bg-blue-100 text-blue-800", icon: Clock },
      UNDER_REVIEW: {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
      },
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-800", icon: AlertCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.SUBMITTED;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Welcome to your TAMS dashboard. Here's what's happening today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge className="bg-red-100 text-red-800">
              {user?.role} • {user?.department}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Requests
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.totalRequests}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.pendingRequests}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-600">Requires attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Mentors
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.activeMentors}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">All mentors available</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Approved This Month
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.approvedRequests}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-purple-600">Great progress!</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest updates and actions in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-xs text-gray-400">
                            {activity.user}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                          {getStatusBadge(activity.status)}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/requests">
                    <Button variant="outline">
                      View All Activities
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getQuickActions().map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div
                        className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Department Overview */}
            {dashboardData && (
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>Requests by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.departmentBreakdown.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {dept.department}
                          </span>
                        </div>
                        <Badge variant="secondary">{dept.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Request submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#dc2626"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Requests by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.departmentBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}