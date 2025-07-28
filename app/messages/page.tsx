"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Messaging } from "@/components/ui/messaging"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageLoading } from "@/components/ui/loading"

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleSendMessage = async (message: string, recipientId: string) => {
    // TODO: Implement actual message sending to backend
    console.log("Sending message:", message, "to:", recipientId)
    
    // Mock API call
    try {
      // const response = await fetch("/api/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message, recipientId })
      // })
      // if (!response.ok) throw new Error("Failed to send message")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return <PageLoading message="Loading messages..." />
  }

  if (!user) {
    return <PageLoading message="User not found..." />
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Connect with your mentors and discuss your internship</p>
          </div>
        </div>

        {/* Messaging Interface */}
        <Card className="h-[calc(100vh-200px)]">
          <CardContent className="p-0 h-full">
            <Messaging 
              user={user} 
              onSendMessage={handleSendMessage}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 