"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'

export default function TestPDFPage() {
  
  const handleTestDownload = async () => {
    try {
      console.log('🔄 Testing PDF download...')
      
      const response = await fetch('/api/test-pdf')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      console.log('✅ PDF response received')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'test-download.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ Download should have triggered')
      
    } catch (error) {
      console.error('❌ Test download failed:', error)
      alert('Test download failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDemoDownload = async () => {
    try {
      console.log('🔄 Testing demo PDF download...')
      
      const response = await fetch('/api/demo/export-pdf')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      console.log('✅ Demo PDF response received')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'demo-call-sheet.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ Demo download should have triggered')
      
    } catch (error) {
      console.error('❌ Demo download failed:', error)
      alert('Demo download failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">PDF Download Test</h1>
            <p className="text-muted-foreground">
              Test PDF generation and download functionality
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple PDF Test</CardTitle>
                <CardDescription>
                  Test with a basic PDF to verify download works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleTestDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Test PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Sheet Demo PDF</CardTitle>
                <CardDescription>
                  Test the actual call sheet PDF generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDemoDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Demo Call Sheet PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Open browser dev tools (F12) and check the Console tab 
              for detailed logs about the download process.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}