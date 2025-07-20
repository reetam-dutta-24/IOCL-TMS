import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard, etc.)
  const pathname = request.nextUrl.pathname

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register']
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/requests', '/mentors', '/reports', '/settings']

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    // In a real application, you would check for a JWT token in cookies
    // For this demo, we'll check localStorage on the client side
    // This is a simplified approach - in production, use proper JWT validation
    
    // For now, let the client-side components handle the authentication check
    // In a real app, you'd validate the token here
    return NextResponse.next()
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Default: allow the request to continue
  return NextResponse.next()
}

export const config = {
  // Match all paths except api routes, static files, and _next
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}