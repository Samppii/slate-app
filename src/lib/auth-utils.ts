import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

// Server-side authentication check
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }
  
  return session
}

// Role-based access control
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth()
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized")
  }
  
  return session
}

// Admin-only access
export async function requireAdmin() {
  return await requireRole(['ADMIN'])
}

// Check if user owns resource
export function isOwnerOrAdmin(userId: string, session: any) {
  return session.user.id === userId || session.user.role === 'ADMIN'
}