import { NextRequest } from 'next/server'
import { requireAuth, apiResponse, handleApiError } from '@/lib/api-utils'
import { CallSheetService } from '@/lib/services/call-sheet.service'
import { callSheetQuerySchema, createCallSheetSchema } from '@/lib/validations/call-sheet'

// GET /api/call-sheets - List call sheets
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    
    // Parse and validate query parameters
    const queryData = callSheetQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      projectType: searchParams.get('projectType'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy') || 'shootDate',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    })

    const result = await CallSheetService.getCallSheets(session.user.id, queryData)

    return apiResponse(result, 'Call sheets retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/call-sheets - Create new call sheet
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    
    // Validate input data
    const validatedData = createCallSheetSchema.parse(body)
    
    const callSheet = await CallSheetService.createCallSheet(session.user.id, validatedData)

    return apiResponse(callSheet, 'Call sheet created successfully', true)
  } catch (error) {
    return handleApiError(error)
  }
}