import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/requests', 
    '/mentors',
    '/reports',
    '/admin',
    '/settings'
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // In a real app, you'd check for authentication token
    // For now, we'll let the client-side handle auth redirects
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}