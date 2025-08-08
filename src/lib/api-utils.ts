import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// Standard API response wrapper
export function apiResponse<T = any>(
  data?: T,
  message?: string,
  success: boolean = true
) {
  return NextResponse.json({
    success,
    data,
    message,
  })
}

// Error response wrapper
export function apiError(
  error: string,
  status: number = 400,
  details?: any
) {
  return NextResponse.json({
    success: false,
    error,
    details,
  }, { status })
}

// Authentication middleware
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  
  return session
}

// Owner or admin authorization
export function requireOwnershipOrAdmin(resourceUserId: string, currentUserId: string, userRole: string) {
  const isOwner = resourceUserId === currentUserId
  const isAdmin = userRole === 'ADMIN'
  
  if (!isOwner && !isAdmin) {
    throw new Error('Forbidden')
  }
}

// Handle different types of errors
export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ZodError) {
    return apiError('Validation failed', 400, error.issues)
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return apiError('Resource already exists', 409)
    }
    if (error.code === 'P2025') {
      return apiError('Resource not found', 404)
    }
    return apiError('Database error', 500)
  }
  
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return apiError('Authentication required', 401)
    }
    if (error.message === 'Forbidden') {
      return apiError('Access denied', 403)
    }
    return apiError(error.message, 500)
  }
  
  return apiError('Internal server error', 500)
}