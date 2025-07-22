"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  X, 
  MarkAsRead,
  Trash2,
  UserPlus,
  FileText,
  Users,
  Settings
} from "lucide-react"

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'system' | 'request' | 'mentor' | 'approval'
  isRead: boolean
  createdAt: string
}

interface NotificationSystemProps {
  userId?: number
}

export function NotificationSystem({ userId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial notifications
    loadNotifications()
    
    // Set up real-time updates (simulate with interval)
    const interval = setInterval(() => {
      // Simulate new notifications
      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        addNewNotification()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [userId])

  const loadNotifications = () => {
    // Simulate loading notifications from API
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "New Access Request",
        message: "Rahul Sharma has requested access to L&D Coordinator role",
        type: "info",
        category: "request",
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
      },
      {
        id: 2,
        title: "Mentor Assignment",
        message: "You have been assigned as mentor for Project Alpha",
        type: "success",
        category: "mentor",
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
      },
      {
        id: 3,
        title: "System Maintenance",
        message: "Scheduled maintenance will begin at 11:00 PM tonight",
        type: "warning",
        category: "system",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: 4,
        title: "Request Approved",
        message: "Your internship request has been approved by L&D HoD",
        type: "success",
        category: "approval",
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ]
    
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
  }

  const addNewNotification = () => {
    const newNotifications = [
      {
        title: "New Internship Request",
        message: "A new internship request has been submitted for review",
        type: "info" as const,
        category: "request" as const
      },
      {
        title: "Mentor Feedback Required",
        message: "Please provide feedback for completed training session",
        type: "warning" as const,
        category: "mentor" as const
      },
      {
        title: "System Update",
        message: "TAMS system has been updated to version 2.1.1",
        type: "success" as const,
        category: "system" as const
      }
    ]

    const randomNotification = newNotifications[Math.floor(Math.random() * newNotifications.length)]
    
    const newNotification: Notification = {
      id: Date.now(),
      ...randomNotification,
      isRead: false,
      createdAt: new Date().toISOString()
    }

    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (notificationId: number) => {
    const notification = notifications.find(n => n.id === notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case 'request':
        return <FileText className="h-4 w-4" />
      case 'mentor':
        return <Users className="h-4 w-4" />
      case 'approval':
        return <CheckCircle className="h-4 w-4" />
      case 'system':
        return <Settings className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-red-600 hover:bg-red-50">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600 text-white flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <CardDescription>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type, notification.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium text-gray-900 ${
                                !notification.isRead ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-blue-100"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full absolute right-3 top-4"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    // Navigate to full notifications page
                    setIsOpen(false)
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}