import { NextRequest } from 'next/server'
import { requireAuth, createApiResponse, handleApiError } from '@/lib/api-utils'
import { CrewMemberService } from '@/lib/services/crew-member-service'
import { UpdateCrewMemberSchema } from '@/lib/validations/crew-member'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { id } = (await params)
    
    const crewMember = await CrewMemberService.getCrewMember(session.user.id!, id)
    
    return createApiResponse(crewMember)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { id } = (await params)
    
    const body = await request.json()
    const validatedData = UpdateCrewMemberSchema.parse(body)
    
    const crewMember = await CrewMemberService.updateCrewMember(session.user.id!, id, validatedData)
    
    return createApiResponse(crewMember)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { id } = (await params)
    
    await CrewMemberService.deleteCrewMember(session.user.id!, id)
    
    return createApiResponse({ message: 'Crew member deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}