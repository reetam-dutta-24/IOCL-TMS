// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [DashboardComponent, setDashboardComponent] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadDashboardComponent(parsedUser.role);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  const loadDashboardComponent = async (role) => {
    try {
      let component;
      
      switch (role) {
        case "Admin":
        case "System Administrator":
          const adminModule = await import("@/components/dashboards/admin-dashboard");
          component = React.createElement(adminModule.AdminDashboard, { user });
          break;
          
        case "L&D HoD":
          const ldHodModule = await import("@/components/dashboards/hod-dashboard");
          component = React.createElement(ldHodModule.HodDashboard, { user, roleType: "LD_HOD" });
          break;
          
        case "Department HoD":
          const deptHodModule = await import("@/components/dashboards/hod-dashboard");
          component = React.createElement(deptHodModule.HodDashboard, { user, roleType: "DEPT_HOD" });
          break;
          
        case "L&D Coordinator":
          const coordinatorModule = await import("@/components/dashboards/coordinator-dashboard");
          component = React.createElement(coordinatorModule.CoordinatorDashboard, { user });
          break;
          
        case "Mentor":
          const mentorModule = await import("@/components/dashboards/mentor-dashboard");
          component = React.createElement(mentorModule.MentorDashboard, { user });
          break;
          
        default:
          console.warn(`Unknown role: ${role}, falling back to coordinator dashboard`);
          const fallbackModule = await import("@/components/dashboards/coordinator-dashboard");
          component = React.createElement(fallbackModule.CoordinatorDashboard, { user });
          break;
      }
      
      setDashboardComponent(() => component);
    } catch (error) {
      console.error("Error loading dashboard component:", error);
      setDashboardComponent(() => React.createElement("div", { className: "p-8 text-center text-red-600" }, "Error loading dashboard"));
    }
  };

  if (loading) {
    return React.createElement("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center" },
      React.createElement("div", { className: "text-center" },
        React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" }),
        React.createElement("p", { className: "text-gray-600" }, "Loading dashboard...")
      )
    );
  }

  if (!user) {
    return null;
  }

  return React.createElement("div", { className: "min-h-screen bg-gray-50" },
    DashboardComponent || React.createElement("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center" },
      React.createElement("div", { className: "text-center" },
        React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" }),
        React.createElement("p", { className: "text-gray-600" }, "Loading dashboard components...")
      )
    )
  );
}