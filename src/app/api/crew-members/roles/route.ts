import { NextRequest } from 'next/server'
import { requireAuth, createApiResponse, handleApiError } from '@/lib/api-utils'
import { CrewMemberService } from '@/lib/services/crew-member-service'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department') || undefined
    
    const roles = await CrewMemberService.getRoles(session.user.id!, department)
    
    return createApiResponse({ roles })
  } catch (error) {
    return handleApiError(error)
  }
}