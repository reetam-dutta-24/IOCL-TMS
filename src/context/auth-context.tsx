"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: string
  department: string | null
}

interface AuthContextType {
  user: User | null
  login: (employeeId: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const loading = status === "loading"

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        employeeId: session.user.employeeId,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role,
        department: session.user.department,
      })
    } else {
      setUser(null)
    }
  }, [session])

  const login = async (employeeId: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        employeeId,
        password,
        redirect: false,
      })

      return result?.ok || false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    await signOut({ redirect: false })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
