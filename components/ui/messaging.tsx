"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  Check, 
  CheckCheck,
  Phone,
  Mail,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  sender: 'trainee' | 'mentor'
  timestamp: Date
  isRead: boolean
}

interface ChatContact {
  id: string
  name: string
  role: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isOnline: boolean
}

interface MessagingProps {
  user: any
  contacts?: ChatContact[]
  onSendMessage?: (message: string, recipientId: string) => void
}

export function Messaging({ user, contacts = [], onSendMessage }: MessagingProps) {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock contacts for demo - different for trainees vs mentors
  const demoContacts: ChatContact[] = user?.role === "Trainee" ? [
    {
      id: "1",
      name: "Vikram Gupta",
      role: "Mentor",
      unreadCount: 2,
      isOnline: true,
      lastMessage: "Great progress on the project!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: "2", 
      name: "Meera Joshi",
      role: "Mentor",
      unreadCount: 0,
      isOnline: false,
      lastMessage: "Let's schedule a review meeting",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ] : [
    {
      id: "1",
      name: "Arjun Sharma",
      role: "Trainee",
      unreadCount: 1,
      isOnline: true,
      lastMessage: "I have a question about the project requirements",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      id: "2", 
      name: "Priya Patel",
      role: "Trainee",
      unreadCount: 0,
      isOnline: false,
      lastMessage: "Thank you for the feedback on my report",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    }
  ]

  const allContacts = contacts.length > 0 ? contacts : demoContacts

  // Mock messages for demo - different for trainees vs mentors
  const demoMessages: Message[] = user?.role === "Trainee" ? [
    {
      id: "1",
      content: "Hi! How's the internship going?",
      sender: 'mentor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true
    },
    {
      id: "2", 
      content: "It's going great! I've completed the initial setup and started working on the first module.",
      sender: 'trainee',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isRead: true
    },
    {
      id: "3",
      content: "Excellent! I'd like to review your progress. Can we schedule a meeting tomorrow?",
      sender: 'mentor', 
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true
    },
    {
      id: "4",
      content: "Sure! I'm available anytime after 2 PM. What works for you?",
      sender: 'trainee',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: false
    }
  ] : [
    {
      id: "1",
      content: "Hi Vikram! I have a question about the project requirements.",
      sender: 'trainee',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true
    },
    {
      id: "2", 
      content: "Of course! What would you like to know?",
      sender: 'mentor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isRead: true
    },
    {
      id: "3",
      content: "I'm not sure about the database schema design. Can you help me understand it better?",
      sender: 'trainee', 
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true
    },
    {
      id: "4",
      content: "Absolutely! Let me send you some resources and we can discuss it in detail.",
      sender: 'mentor',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: false
    }
  ]

  useEffect(() => {
    if (selectedContact) {
      setMessages(demoMessages)
    }
  }, [selectedContact])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user?.role === "Trainee" ? 'trainee' : 'mentor',
      timestamp: new Date(),
      isRead: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    if (onSendMessage) {
      onSendMessage(newMessage, selectedContact.id)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return formatTime(date)
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="h-full flex">
      {/* Contacts List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
          <CardDescription>
            {user?.role === "Trainee" ? "Connect with your mentors" : "Connect with your trainees"}
          </CardDescription>
        </CardHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {allContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatDate(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate">
                        {contact.lastMessage || "No messages yet"}
                      </p>
                      {contact.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedContact.role}
                    </Badge>
                    <span className={`text-xs ${selectedContact.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedContact.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Block Contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'trainee' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'trainee'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        message.sender === 'trainee' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.sender === 'trainee' && (
                          message.isRead ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <p className="text-sm">Typing...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a contact</h3>
              <p className="text-gray-500">
                {user?.role === "Trainee" ? "Choose a mentor to start messaging" : "Choose a trainee to start messaging"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 