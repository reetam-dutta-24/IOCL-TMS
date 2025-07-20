import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/requests/:path*",
    "/mentors/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/api/internships/:path*",
    "/api/mentors/:path*",
    "/api/dashboard/:path*",
  ],
}
