import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {AuthProvider} from "@/src/context/auth-context";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IOCL TAMS - Trainee Approval & Management System",
  description: "Indian Oil Corporation Limited - Trainee Approval & Management System for streamlined internship and training management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
