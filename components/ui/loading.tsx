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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
      <div className="text-center animate-scale-in">
        <div className="flex items-center justify-center mb-6">
          <IndianOilLogo width={64} height={64} className="mr-4 animate-float" />
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

export function ButtonLoading({ 
  children, 
  loading = false, 
  loadingText = "Loading...", 
  className,
  ...props 
}: any) {
  return (
    <button 
      className={cn("btn-animate", className)} 
      disabled={loading} 
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export function SkeletonLoader({ 
  className,
  lines = 3,
  showAvatar = false 
}: { 
  className?: string
  lines?: number
  showAvatar?: boolean 
}) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="w-12 h-12 bg-gray-200 rounded-full loading-skeleton"></div>
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-4 bg-gray-200 rounded loading-skeleton",
                i === lines - 1 ? "w-3/4" : "w-full"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-6 animate-pulse", className)}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg loading-skeleton"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded loading-skeleton mb-2"></div>
          <div className="h-3 bg-gray-200 rounded loading-skeleton w-3/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded loading-skeleton"></div>
        <div className="h-3 bg-gray-200 rounded loading-skeleton w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded loading-skeleton w-4/6"></div>
      </div>
    </div>
  )
}

export function TableSkeleton({ 
  rows = 5, 
  cols = 4,
  className 
}: { 
  rows?: number
  cols?: number
  className?: string 
}) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="flex space-x-4">
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded loading-skeleton flex-1"></div>
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b last:border-b-0 px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={cn(
                    "h-4 bg-gray-200 rounded loading-skeleton flex-1",
                    colIndex === 0 ? "w-16" : ""
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded loading-skeleton w-24"></div>
          <div className="h-10 bg-gray-200 rounded loading-skeleton"></div>
        </div>
      ))}
      <div className="h-10 bg-gray-200 rounded loading-skeleton w-32"></div>
    </div>
  )
}

// Page transition wrapper
export function PageTransition({ 
  children, 
  isLoading = false,
  className 
}: { 
  children: React.ReactNode
  isLoading?: boolean
  className?: string 
}) {
  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  )
}

// Loading overlay for forms or sections
export function LoadingOverlay({ 
  loading, 
  children, 
  text = "Processing...",
  className 
}: {
  loading: boolean
  children: React.ReactNode
  text?: string
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm font-medium">{text}</p>
          </div>
        </div>
      )}
    </div>
  )
}