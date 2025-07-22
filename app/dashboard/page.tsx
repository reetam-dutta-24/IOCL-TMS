"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { CoordinatorDashboard } from "@/components/dashboard/coordinator-dashboard"
import { HodDashboard } from "@/components/dashboard/hod-dashboard"
import { MentorDashboard } from "@/components/dashboard/mentor-dashboard"
import { PageLoading } from "@/components/ui/page-loading"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  if (loading) {
    return <PageLoading message="Loading dashboard..." />
  }

  if (!user) {
    return null
  }

  const renderRoleBasedDashboard = () => {
    switch (user.role) {
      case "Admin":
        return <AdminDashboard />
      case "L&D Coordinator":
        return <CoordinatorDashboard />
      case "L&D HoD":
        return <HodDashboard userRole="L&D HoD" userDepartment={user.department} />
      case "Department HoD":
        return <HodDashboard userRole="Department HoD" userDepartment={user.department} />
      case "Mentor":
        return <MentorDashboard />
      default:
        return <div>Dashboard not configured for your role.</div>
    }
  }

  return (
    <DashboardLayout user={user}>
      {renderRoleBasedDashboard()}
    </DashboardLayout>
  )
}