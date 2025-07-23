"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic imports to avoid TypeScript conflicts
const AdminDashboard = dynamic(() => import("../../components/dashboards/admin-dashboard").then(mod => ({ default: mod.AdminDashboard })), {
  loading: () => <div>Loading Admin Dashboard...</div>
});

const CoordinatorDashboard = dynamic(() => import("../../components/dashboards/coordinator-dashboard").then(mod => ({ default: mod.CoordinatorDashboard })), {
  loading: () => <div>Loading Coordinator Dashboard...</div>
});

const HodDashboard = dynamic(() => import("../../components/dashboards/hod-dashboard").then(mod => ({ default: mod.HodDashboard })), {
  loading: () => <div>Loading HoD Dashboard...</div>
});

const MentorDashboard = dynamic(() => import("../../components/dashboards/mentor-dashboard").then(mod => ({ default: mod.MentorDashboard })), {
  loading: () => <div>Loading Mentor Dashboard...</div>
});

const PageLoading = dynamic(() => import("../../components/ui/loading").then(mod => ({ default: mod.PageLoading })), {
  loading: () => <div>Loading...</div>
});

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