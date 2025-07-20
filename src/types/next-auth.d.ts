declare module "next-auth" {
  interface Session {
    user: {
      id: string
      employeeId: string
      name: string
      email: string
      role: string
      department: string | null
    }
  }

  interface User {
    employeeId: string
    role: string
    department: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    employeeId: string
    role: string
    department: string | null
  }
}
