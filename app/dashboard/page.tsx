// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Static imports to ensure modules are found
import { AdminDashboard } from "../../components/dashboards/admin-dashboard";
import { CoordinatorDashboard } from "../../components/dashboards/coordinator-dashboard";
import { LndHodDashboard } from "../../components/dashboards/lnd-hod-dashboard";
import { HodDashboard } from "../../components/dashboards/hod-dashboard";
import { DepartmentHoDDashboard } from "../../components/dashboards/department-hod-dashboard";
import { MentorDashboard } from "../../components/dashboards/mentor-dashboard";

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
      loadDashboardComponent(parsedUser.role, parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  const loadDashboardComponent = (role, userData) => {
    try {
      let component;
      
      switch (role) {
        case "Admin":
        case "System Administrator":
          component = React.createElement(AdminDashboard, { user: userData });
          break;
          
        case "L&D HoD":
          component = React.createElement(LndHodDashboard, { user: userData });
          break;
          
        case "Department HoD":
          component = React.createElement(DepartmentHoDDashboard, { user: userData });
          break;
          
        case "L&D Coordinator":
          component = React.createElement(CoordinatorDashboard, { user: userData });
          break;
          
        case "Mentor":
          component = React.createElement(MentorDashboard, { user: userData });
          break;
          
        default:
          console.warn(`Unknown role: ${role}, falling back to coordinator dashboard`);
          component = React.createElement(CoordinatorDashboard, { user: userData });
          break;
      }
      
      setDashboardComponent(component);
    } catch (error) {
      console.error("Error loading dashboard component:", error);
      setDashboardComponent(React.createElement("div", { className: "p-8 text-center text-red-600" }, "Error loading dashboard"));
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