"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  employeeId: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User, token: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("auth-token")

    if (userData && token) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("auth-token", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("auth-token")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
};