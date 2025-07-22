"use client"

import { cn } from "@/lib/utils"
import { IndianOilLogo } from "@/components/ui/logo"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
  fullScreen?: boolean
}

export function Loading({ 
  className, 
  size = "md", 
  text = "Loading...", 
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center p-4"

  return (
    <div className={cn(containerClasses, className)}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className={cn("animate-spin text-red-600", sizeClasses[size])} />
        </div>
        {text && (
          <p className="text-gray-600 text-sm font-medium">{text}</p>
        )}
      </div>
    </div>
  )
}

export function PageLoading({ message = "Loading page..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <IndianOilLogo width={64} height={64} className="mr-4 animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">IOCL TAMS</h2>
            <p className="text-sm text-gray-600">Trainee Approval & Management System</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          <span className="text-gray-700 font-medium">{message}</span>
        </div>
        <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
          <div className="bg-red-600 h-2 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  )
}

export function SectionLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-red-600 mr-2" />
      <span className="text-gray-600">Loading...</span>
    </div>
  )
}