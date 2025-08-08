import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, handleApiError } from '@/lib/api-utils'
import { CallSheetService } from '@/lib/services/call-sheet.service'

// POST /api/call-sheets/[id]/duplicate - Duplicate call sheet
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params
    
    const duplicatedCallSheet = await CallSheetService.duplicateCallSheet(id, session.user.id)

    return apiResponse(duplicatedCallSheet, 'Call sheet duplicated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}