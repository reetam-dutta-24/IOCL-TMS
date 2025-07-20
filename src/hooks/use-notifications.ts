"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Notification {
  id: number
  title: string
  message: string
  type: "EMAIL" | "SMS" | "IN_APP" | "PUSH"
  isRead: boolean
  priority: "LOW" | "MEDIUM" | "HIGH"
  createdAt: string
}

export function useNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Mock data fallback
      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: "New Request Submitted",
          message: "A new internship request has been submitted for review",
          type: "IN_APP",
          isRead: false,
          priority: "HIGH",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Mentor Assignment",
          message: "You have been assigned as a mentor for a new intern",
          type: "EMAIL",
          isRead: false,
          priority: "MEDIUM",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          title: "Request Approved",
          message: "Your internship request has been approved",
          type: "IN_APP",
          isRead: true,
          priority: "HIGH",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ]
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.isRead).length)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}
