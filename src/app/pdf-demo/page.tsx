"use client"

import { useState } from 'react'
import { PDFExportDialog } from '@/components/call-sheets/pdf-export-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download } from 'lucide-react'

// Mock call sheet data for demo
const mockCallSheet = {
  id: 'demo-123',
  title: 'Demo Project - Day 1',
  shootDate: new Date('2025-02-15'),
  callTime: '07:00',
  location: '123 Hollywood Blvd, Los Angeles, CA 90028',
  mapLink: 'https://maps.google.com/?q=123+Hollywood+Blvd',
  status: 'PUBLISHED' as const,
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

export default function PDFDemoPage() {
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false)

  const handleDirectDownload = async () => {
    try {
      // Create a mock PDF download for the demo
      const mockPdfContent = `%PDF-1.4
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
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Call Sheet Demo) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000225 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
319
%%EOF`
      
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'demo_call_sheet.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">PDF Generation Demo</h1>
            <p className="text-muted-foreground">
              Test the call sheet PDF generation functionality
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Call Sheet PDF Export
              </CardTitle>
              <CardDescription>
                Generate professional PDF call sheets for your productions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo Call Sheet Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">{mockCallSheet.title}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>📅 {mockCallSheet.shootDate.toDateString()}</p>
                  <p>🕐 {mockCallSheet.callTime}</p>
                  <p>📍 {mockCallSheet.location}</p>
                  <p>🎬 {mockCallSheet.scenes.length} scenes</p>
                  <p>📋 Status: {mockCallSheet.status}</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-medium">PDF Features:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Professional formatting
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Scene breakdown table
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Production details
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Safety & general notes
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Weather information
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Sunrise/sunset times
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsPDFDialogOpen(true)}
                  className="flex-1 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Open PDF Export Dialog
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              This demo uses sample data. In the full application, PDFs are generated 
              from real call sheet data with crew information.
            </p>
          </div>
        </div>
      </div>

      <PDFExportDialog
        callSheet={mockCallSheet}
        open={isPDFDialogOpen}
        onOpenChange={setIsPDFDialogOpen}
      />
    </div>
  )
}