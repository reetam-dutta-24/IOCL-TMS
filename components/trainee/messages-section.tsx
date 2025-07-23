"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Send, Reply, Clock, Check } from "lucide-react"

interface Message {
  id: number
  senderId: number
  senderName: string
  senderRole: string
  receiverId: number
  subject?: string
  message: string
  isRead: boolean
  sentAt: string
  readAt?: string
}

interface MessagesSectionProps {
  userId: string
}

export function MessagesSection({ userId }: MessagesSectionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [newMessage, setNewMessage] = useState({
    receiverId: "",
    subject: "",
    message: ""
  })

  useEffect(() => {
    loadMessages()
  }, [userId])

  const loadMessages = async () => {
    try {
      // Mock data for demonstration
      const mockMessages: Message[] = [
        {
          id: 1,
          senderId: 4,
          senderName: "Sunita Patel",
          senderRole: "Mentor",
          receiverId: parseInt(userId),
          subject: "Weekly Check-in",
          message: "Hi Arjun, how are you progressing with the React assignment? Let me know if you need any clarification on the requirements.",
          isRead: false,
          sentAt: "2024-01-22T09:30:00Z"
        },
        {
          id: 2,
          senderId: parseInt(userId),
          senderName: "Arjun Reddy",
          senderRole: "Trainee",
          receiverId: 4,
          subject: "Re: Question about React state management",
          message: "Thank you for the explanation! The useContext vs Redux clarification really helped. I'll implement the context API for this project.",
          isRead: true,
          sentAt: "2024-01-21T14:15:00Z",
          readAt: "2024-01-21T14:20:00Z"
        },
        {
          id: 3,
          senderId: 4,
          senderName: "Sunita Patel",
          senderRole: "Mentor",
          receiverId: parseInt(userId),
          subject: "Question about React state management",
          message: "Great question! For smaller applications, useContext is sufficient. Redux is better for complex state management. Let's discuss this in our next meeting.",
          isRead: true,
          sentAt: "2024-01-21T10:45:00Z",
          readAt: "2024-01-21T11:00:00Z"
        },
        {
          id: 4,
          senderId: parseInt(userId),
          senderName: "Arjun Reddy", 
          senderRole: "Trainee",
          receiverId: 4,
          subject: "Question about React state management",
          message: "Hi, I'm having trouble understanding when to use useContext vs Redux. Could you help clarify the differences and when to use each?",
          isRead: true,
          sentAt: "2024-01-21T09:30:00Z",
          readAt: "2024-01-21T10:30:00Z"
        },
        {
          id: 5,
          senderId: 2,
          senderName: "Priya Sharma",
          senderRole: "L&D Coordinator",
          receiverId: parseInt(userId),
          subject: "Internship Mid-term Review",
          message: "Hi Arjun, we'll be conducting mid-term reviews next week. Please prepare a presentation covering your progress and learnings so far.",
          isRead: true,
          sentAt: "2024-01-20T16:00:00Z",
          readAt: "2024-01-20T18:30:00Z"
        }
      ]
      setMessages(mockMessages)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load messages:", error)
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    try {
      // In real implementation, this would call the API
      const message: Message = {
        id: messages.length + 1,
        senderId: parseInt(userId),
        senderName: "Arjun Reddy",
        senderRole: "Trainee",
        receiverId: parseInt(newMessage.receiverId),
        subject: newMessage.subject,
        message: newMessage.message,
        isRead: false,
        sentAt: new Date().toISOString()
      }
      
      setMessages([message, ...messages])
      setNewMessage({
        receiverId: "",
        subject: "",
        message: ""
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const markAsRead = async (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, isRead: true, readAt: new Date().toISOString() }
        : msg
    ))
  }

  const getMessagePreview = (message: string) => {
    return message.length > 100 ? message.substring(0, 100) + "..." : message
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return <div>Loading messages...</div>
  }

  const receivedMessages = messages.filter(msg => msg.receiverId === parseInt(userId))
  const sentMessages = messages.filter(msg => msg.senderId === parseInt(userId))
  const unreadCount = receivedMessages.filter(msg => !msg.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Messages</h3>
          <p className="text-sm text-gray-600">
            Communicate with your mentor and coordinators 
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="receiverId">To</Label>
                <select
                  id="receiverId"
                  value={newMessage.receiverId}
                  onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select recipient</option>
                  <option value="4">Sunita Patel (Mentor)</option>
                  <option value="2">Priya Sharma (L&D Coordinator)</option>
                  <option value="1">Rajesh Kumar (L&D HoD)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  placeholder="Enter message subject"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  placeholder="Type your message..."
                  rows={6}
                />
              </div>
              <Button onClick={handleSendMessage} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Message View */}
      {selectedMessage ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {selectedMessage.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMessage.senderName}</p>
                  <p className="text-sm text-gray-500">{selectedMessage.senderRole}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                Back to Messages
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{selectedMessage.subject}</h4>
              <p className="text-sm text-gray-500">
                {formatDate(selectedMessage.sentAt)}
              </p>
            </div>
            <div className="whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">
              {selectedMessage.message}
            </div>
            <Button variant="outline" className="w-full">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Messages List */
        <div className="space-y-4">
          {/* Received Messages */}
          <div>
            <h4 className="font-medium mb-3">Received Messages ({receivedMessages.length})</h4>
            <div className="space-y-3">
              {receivedMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${!message.isRead ? 'border-blue-200 bg-blue-50' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message)
                    if (!message.isRead) {
                      markAsRead(message.id)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{message.senderName}</p>
                            <Badge variant="outline" className="text-xs">
                              {message.senderRole}
                            </Badge>
                            {!message.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getMessagePreview(message.message)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(message.sentAt)}
                        </span>
                        {message.isRead ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Clock className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sent Messages */}
          <div>
            <h4 className="font-medium mb-3">Sent Messages ({sentMessages.length})</h4>
            <div className="space-y-3">
              {sentMessages.map((message) => (
                <Card 
                  key={message.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-gray-600">To: </p>
                          <p className="font-medium text-sm">
                            {/* In real app, you'd resolve receiver name */}
                            {message.receiverId === 4 ? "Sunita Patel" : 
                             message.receiverId === 2 ? "Priya Sharma" : "Unknown"}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getMessagePreview(message.message)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(message.sentAt)}
                        </span>
                        {message.readAt ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Clock className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
          <p className="text-gray-600 mb-4">Start a conversation with your mentor or coordinator</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Send Your First Message
          </Button>
        </div>
      )}
    </div>
  )
}