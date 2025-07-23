"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import role-specific dashboard components
import { 
  AdminDashboard,
  CoordinatorDashboard,
  HodDashboard,
  MentorDashboard
} from "@/components/dashboards";
import { PageLoading } from "@/components/ui/loading";

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  if (!user) {
    return null;
  }

  // Route to role-specific dashboard
  const renderDashboard = () => {
    switch (user.role) {
      case "Admin":
      case "System Administrator":
        return <AdminDashboard user={user} />;
      
      case "L&D HoD":
        return <HodDashboard user={user} roleType="LD_HOD" />;
      
      case "Department HoD":
        return <HodDashboard user={user} roleType="DEPT_HOD" />;
      
      case "L&D Coordinator":
        return <CoordinatorDashboard user={user} />;
      
      case "Mentor":
        return <MentorDashboard user={user} />;
      
      default:
        // Fallback to coordinator dashboard for unknown roles
        console.warn(`Unknown role: ${user.role}, falling back to coordinator dashboard`);
        return <CoordinatorDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
}