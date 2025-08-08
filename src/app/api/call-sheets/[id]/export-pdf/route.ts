import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { requireAuth, createApiResponse, handleApiError } from '@/lib/api-utils'
import { CallSheetService } from '@/lib/services/call-sheet-service'
import { CallSheetPDF } from '@/lib/pdf/call-sheet-template'
import { use } from 'react'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { id } = use(params)
    
    // Get the call sheet with all related data
    const callSheet = await CallSheetService.getCallSheet(session.user.id!, id)
    
    if (!callSheet) {
      return NextResponse.json(
        { error: 'Call sheet not found' },
        { status: 404 }
      )
    }

    // Generate the PDF
    const pdfBuffer = await renderToBuffer(<CallSheetPDF callSheet={callSheet} />)
    
    // Create filename
    const filename = `${callSheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_call_sheet.pdf`
    
    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    return handleApiError(error)
  }
}