import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IOCL TAMS - Trainee Approval & Management System",
  description: "A comprehensive system for managing trainee approvals, mentor assignments, and training programs at Indian Oil Corporation Limited",
  keywords: ["IOCL", "TAMS", "trainee management", "internship", "mentorship", "Indian Oil"],
  authors: [{ name: "IOCL L&D Department" }],
  creator: "Indian Oil Corporation Limited",
  publisher: "IOCL",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ef4444",
  openGraph: {
    title: "IOCL TAMS - Trainee Approval & Management System",
    description: "Streamlined training and mentorship management for IOCL",
    type: "website",
    locale: "en_IN",
    siteName: "IOCL TAMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "IOCL TAMS",
    description: "Trainee Approval & Management System",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root" className="min-h-screen">
          <main className="relative">
            {children}
          </main>
        </div>
        
        {/* Global Loading Indicator */}
        <div id="loading-portal" />
        
        {/* Accessibility Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-red-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
      </body>
    </html>
  )
}