"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and redirect appropriately
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === "Trainee") {
        router.push("/trainee")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">IOCL Trainee Management System</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
