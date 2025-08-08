import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, handleApiError } from '@/lib/api-utils'
import { CallSheetService } from '@/lib/services/call-sheet.service'
import { updateCallSheetSchema } from '@/lib/validations/call-sheet'

// GET /api/call-sheets/[id] - Get specific call sheet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params
    
    const callSheet = await CallSheetService.getCallSheet(id, session.user.id)

    return apiResponse(callSheet, 'Call sheet retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/call-sheets/[id] - Update call sheet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params
    const body = await request.json()
    
    // Validate input data
    const validatedData = updateCallSheetSchema.parse(body)
    
    const callSheet = await CallSheetService.updateCallSheet(id, session.user.id, validatedData)

    return apiResponse(callSheet, 'Call sheet updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/call-sheets/[id] - Delete call sheet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params
    
    const result = await CallSheetService.deleteCallSheet(id, session.user.id)

    return apiResponse(result, 'Call sheet deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}