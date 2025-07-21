import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {AuthProvider} from "@/src/context/auth-context";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IOCL TAMS - Trainee Approval & Management System",
  description: "Indian Oil Corporation Limited - Trainee Approval & Management System for streamlined internship and training management",
  icons: {
    icon: '/logo/indianoil-logo.svg',
    apple: '/logo/indianoil-logo.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo/indianoil-logo.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}