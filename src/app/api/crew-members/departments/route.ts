import { NextRequest } from 'next/server'
import { requireAuth, createApiResponse, handleApiError } from '@/lib/api-utils'
import { CrewMemberService } from '@/lib/services/crew-member-service'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    const departments = await CrewMemberService.getDepartments(session.user.id!)
    
    return createApiResponse({ departments })
  } catch (error) {
    return handleApiError(error)
  }
}