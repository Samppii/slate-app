import { NextResponse } from 'next/server'

// Create a simple but valid PDF without React PDF to avoid SSR issues
function createSimplePDF(callSheet: any): string {
  const content = `BT
/F1 18 Tf
50 750 Td
(${callSheet.title.replace(/[()\\]/g, '')}) Tj
0 -30 Td
/F1 12 Tf
(CALL SHEET) Tj
0 -40 Td
(Date: ${callSheet.shootDate.toDateString().replace(/[()\\]/g, '')}) Tj
0 -20 Td
(Call Time: ${callSheet.callTime.replace(/[()\\]/g, '')}) Tj
0 -20 Td
(Location: ${callSheet.location.replace(/[()\\]/g, '')}) Tj
0 -40 Td
(Status: ${callSheet.status}) Tj
0 -20 Td
(Weather: ${(callSheet.weather || 'N/A').replace(/[()\\]/g, '')}) Tj
0 -40 Td
(SCENES:) Tj
0 -20 Td
(${callSheet.scenes.map((s: any) => s.sceneNumber + ': ' + s.description.replace(/[()\\]/g, '')).join(', ')}) Tj
ET`

  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/ProcSet [/PDF /Text]
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj

4 0 obj
<<
/Length ${content.length}
>>
stream
${content}
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000364 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${564 + content.length}
%%EOF`
}

// Mock call sheet data for demo
const mockCallSheet = {
  id: 'demo-123',
  title: 'Demo Project - Day 1',
  shootDate: new Date('2025-02-15'),
  callTime: '07:00',
  location: '123 Hollywood Blvd, Los Angeles, CA 90028',
  mapLink: 'https://maps.google.com/?q=123+Hollywood+Blvd',
  status: 'SENT' as const,
  projectType: 'Feature Film',
  weather: 'Sunny, 75°F',
  sunrise: '6:45 AM',
  sunset: '6:30 PM',
  generalNotes: 'Please arrive 15 minutes early for safety briefing. Parking is available on Vine Street.',
  safetyNotes: 'Hard hats required in construction areas. No smoking on set.',
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date('2025-01-20'),
  createdById: 'demo-user',
  scenes: [
    {
      id: 'scene-1',
      sceneNumber: '1A',
      description: 'INT. COFFEE SHOP - MORNING',
      location: 'Downtown Coffee Shop',
      timeOfDay: 'Day',
      pages: 2.5,
      estimatedTime: '3 hours',
      notes: 'Need background extras',
      callSheetId: 'demo-123'
    },
    {
      id: 'scene-2',
      sceneNumber: '1B', 
      description: 'EXT. COFFEE SHOP - CONTINUOUS',
      location: 'Downtown Coffee Shop Exterior',
      timeOfDay: 'Day',
      pages: 1.0,
      estimatedTime: '1 hour',
      notes: 'Street parking coordination required',
      callSheetId: 'demo-123'
    }
  ],
  createdBy: {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@slate.com'
  }
}

export async function GET() {
  try {
    console.log('🔄 Generating demo PDF...')
    
    // Generate simple PDF
    const pdfContent = createSimplePDF(mockCallSheet)
    const pdfBuffer = Buffer.from(pdfContent, 'utf-8')
    
    console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes')
    
    // Create filename
    const filename = 'demo_call_sheet.pdf'
    
    // Return PDF with proper headers for download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('❌ PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}