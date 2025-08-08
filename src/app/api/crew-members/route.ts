import { NextRequest } from 'next/server'
import { requireAuth, createApiResponse, handleApiError } from '@/lib/api-utils'
import { CrewMemberService } from '@/lib/services/crew-member-service'
import { CreateCrewMemberSchema, CrewMemberQuerySchema } from '@/lib/validations/crew-member'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams)
    
    const validatedQuery = CrewMemberQuerySchema.parse(queryParams)
    const result = await CrewMemberService.getCrewMembers(session.user.id!, validatedQuery)
    
    return createApiResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    console.log('Session user:', session.user)
    
    const body = await request.json()
    const validatedData = CreateCrewMemberSchema.parse(body)
    
    const crewMember = await CrewMemberService.createCrewMember(session.user.id!, validatedData)
    
    return createApiResponse(crewMember, 201)
  } catch (error) {
    return handleApiError(error)
  }
}