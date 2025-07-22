"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Loading, 
  PageLoading, 
  SectionLoading, 
  ButtonLoading, 
  SkeletonLoader, 
  CardSkeleton, 
  TableSkeleton, 
  FormSkeleton,
  LoadingOverlay,
  PageTransition
} from "@/components/ui/loading"
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Zap, 
  Shield,
  RefreshCw
} from "lucide-react"

export default function AnimationsDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [overlayLoading, setOverlayLoading] = useState(false)

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  const handleOverlayDemo = () => {
    setOverlayLoading(true)
    setTimeout(() => setOverlayLoading(false), 3000)
  }

  const animationClasses = [
    "animate-fade-in",
    "animate-slide-in-left", 
    "animate-slide-in-right",
    "animate-slide-in-up",
    "animate-slide-in-down",
    "animate-scale-in",
    "animate-float",
    "animate-bounce-custom"
  ]

  if (isPageLoading) {
    return <PageLoading message="Loading Animations Demo..." />
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-slide-in-down">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors hover-lift mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">TAMS Animation Showcase</h1>
            <p className="text-xl text-gray-600">
              A comprehensive demonstration of all loading states and animations implemented in IOCL TAMS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Loading Components */}
            <Card className="animate-slide-in-left hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-red-600" />
                  Basic Loading Components
                </CardTitle>
                <CardDescription>
                  Standard loading spinners and indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Small Loading</h4>
                  <Loading size="sm" text="Loading..." />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Medium Loading</h4>
                  <Loading size="md" text="Processing..." />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Large Loading</h4>
                  <Loading size="lg" text="Please wait..." />
                </div>
              </CardContent>
            </Card>

            {/* Button Loading States */}
            <Card className="animate-slide-in-right hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Interactive Loading States
                </CardTitle>
                <CardDescription>
                  Button and form loading demonstrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ButtonLoading 
                  loading={activeDemo === "button1"} 
                  loadingText="Submitting..."
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => {
                    setActiveDemo("button1")
                    setTimeout(() => setActiveDemo(null), 2000)
                  }}
                >
                  Submit Form
                </ButtonLoading>
                
                <Button
                  variant="outline"
                  onClick={handleOverlayDemo}
                  className="w-full hover-lift"
                >
                  Test Loading Overlay
                </Button>
              </CardContent>
            </Card>

            {/* Skeleton Loaders */}
            <Card className="animate-slide-in-up animate-delay-200 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Skeleton Loading States
                </CardTitle>
                <CardDescription>
                  Placeholder content while data loads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Basic Skeleton</h4>
                  <SkeletonLoader lines={3} />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Avatar Skeleton</h4>
                  <SkeletonLoader lines={2} showAvatar />
                </div>
              </CardContent>
            </Card>

            {/* Complex Skeletons */}
            <Card className="animate-slide-in-up animate-delay-400 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-red-600" />
                  Complex Loading Patterns
                </CardTitle>
                <CardDescription>
                  Card and form skeleton patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Card Skeleton</h4>
                  <CardSkeleton />
                </div>
              </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card className="lg:col-span-2 animate-scale-in animate-delay-600 hover-lift">
              <CardHeader>
                <CardTitle>Table Loading Pattern</CardTitle>
                <CardDescription>
                  Skeleton loader for data tables and lists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={4} cols={5} />
              </CardContent>
            </Card>

            {/* Form Skeleton */}
            <Card className="animate-slide-in-left animate-delay-800 hover-lift">
              <CardHeader>
                <CardTitle>Form Loading Pattern</CardTitle>
                <CardDescription>
                  Skeleton for form fields and inputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormSkeleton />
              </CardContent>
            </Card>

            {/* Animation Classes Demo */}
            <Card className="animate-slide-in-right animate-delay-800 hover-lift">
              <CardHeader>
                <CardTitle>Animation Classes</CardTitle>
                <CardDescription>
                  CSS animation utilities in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {animationClasses.map((className, index) => (
                    <Button
                      key={className}
                      variant="outline"
                      size="sm"
                      className={`${className} animate-delay-${(index + 1) * 100} hover-lift`}
                      onClick={() => {
                        // Re-trigger animation
                        const btn = document.getElementById(`anim-${index}`)
                        if (btn) {
                          btn.classList.remove(className)
                          setTimeout(() => btn.classList.add(className), 10)
                        }
                      }}
                      id={`anim-${index}`}
                    >
                      {className.replace('animate-', '')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading Overlay Demo */}
          <LoadingOverlay 
            loading={overlayLoading} 
            text="Processing your request..."
            className="mt-8"
          >
            <Card className="animate-fade-in hover-lift">
              <CardHeader>
                <CardTitle>Loading Overlay Demo</CardTitle>
                <CardDescription>
                  This section demonstrates the loading overlay functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Click the "Test Loading Overlay" button above to see this section covered with a loading overlay.
                  This pattern is useful for forms, data tables, or any content that needs to be disabled during processing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Content 1</span>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Content 2</span>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Content 3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </LoadingOverlay>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-in-up animate-delay-1000 hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized animations with 60fps performance</p>
            </div>
            <div className="text-center animate-slide-in-up animate-delay-1200 hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibility First</h3>
              <p className="text-gray-600">Respects user motion preferences</p>
            </div>
            <div className="text-center animate-slide-in-up animate-delay-1400 hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Experience</h3>
              <p className="text-gray-600">Smooth, delightful interactions</p>
            </div>
          </div>

          {/* Implementation Notes */}
          <Card className="mt-12 animate-fade-in animate-delay-1600">
            <CardHeader>
              <CardTitle>Implementation Notes</CardTitle>
              <CardDescription>
                How these animations enhance the TAMS user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Performance Optimized</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CSS-based animations for 60fps performance</li>
                    <li>• Reduced motion support for accessibility</li>
                    <li>• Mobile-optimized animation durations</li>
                    <li>• Hardware acceleration enabled</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">User Experience</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Consistent loading states across all pages</li>
                    <li>• Skeleton loaders reduce perceived wait time</li>
                    <li>• Staggered animations create visual hierarchy</li>
                    <li>• Hover effects provide interactive feedback</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-8 text-center animate-slide-in-up animate-delay-1800">
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white hover-lift hover-glow btn-animate">
                <RefreshCw className="mr-2 h-4 w-4" />
                Return to TAMS Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}