declare module "next-auth" {
  interface Session {
    user: {
      id: number
      employeeId: string
      name: string
      email: string
      role: string
      department: string
    }
  }

  interface User {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    email: string
    role: string
    department: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    employeeId: string
    role: string
    department: string
  }
}
