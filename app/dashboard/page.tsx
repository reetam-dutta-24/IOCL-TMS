"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import role-specific dashboard components
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { CoordinatorDashboard } from "@/components/dashboards/coordinator-dashboard";
import { HodDashboard } from "@/components/dashboards/hod-dashboard";
import { MentorDashboard } from "@/components/dashboards/mentor-dashboard";
import { PageLoading } from "@/components/ui/page-loading";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
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
        return <CoordinatorDashboard user={user} />;
    }
  };

  return renderDashboard();
}