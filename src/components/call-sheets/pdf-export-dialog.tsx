"use client"

import { useState } from 'react'
import { CallSheetWithRelations } from '@/lib/types/database'
import { useSafeUiStore } from '@/lib/stores/safe-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  MapPin,
  Clock,
  Users,
  AlertTriangle
} from 'lucide-react'

interface PDFExportDialogProps {
  callSheet: CallSheetWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PDFExportDialog({ 
  callSheet, 
  open, 
  onOpenChange 
}: PDFExportDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { addNotification } = useSafeUiStore()

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      
      // Use demo endpoint for demo call sheet, real endpoint for others
      const endpoint = callSheet.id === 'demo-123' 
        ? '/api/demo/export-pdf'
        : `/api/call-sheets/${callSheet.id}/export-pdf`
      
      console.log('🔄 Fetching PDF from:', endpoint)
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      console.log('✅ PDF response received, creating download...')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${callSheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_call_sheet.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ Download triggered successfully')
      
      addNotification({
        type: 'success',
        title: 'PDF Generated',
        message: 'Call sheet PDF has been downloaded successfully.',
      })
      
    } catch (error) {
      console.error('PDF download error:', error)
      addNotification({
        type: 'error',
        title: 'PDF Generation Failed',
        message: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreview = async () => {
    try {
      setIsGenerating(true)
      
      const endpoint = callSheet.id === 'demo-123' 
        ? '/api/demo/export-pdf'
        : `/api/call-sheets/${callSheet.id}/export-pdf`
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      
    } catch (error) {
      console.error('PDF preview error:', error)
      addNotification({
        type: 'error',
        title: 'PDF Preview Failed',
        message: 'There was an error previewing the PDF. Please try again.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Call Sheet PDF
          </DialogTitle>
          <DialogDescription>
            Generate and download a professional PDF version of your call sheet.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-1">
          <div className="space-y-6">
            {/* Call Sheet Preview */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold">{callSheet.title}</h3>
                <p className="text-sm text-muted-foreground">Call Sheet Preview</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(callSheet.shootDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(callSheet.callTime)}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{callSheet.location}</span>
                </div>
              </div>

              {/* Scenes Summary */}
              {callSheet.scenes && callSheet.scenes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {callSheet.scenes.length} Scene{callSheet.scenes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {callSheet.scenes.slice(0, 5).map((scene) => (
                      <Badge key={scene.id} variant="secondary" className="text-xs">
                        {scene.sceneNumber}
                      </Badge>
                    ))}
                    {callSheet.scenes.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{callSheet.scenes.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    callSheet.status === 'SENT' ? 'default' :
                    callSheet.status === 'DRAFT' ? 'secondary' : 'outline'
                  }
                >
                  {callSheet.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Created {new Date(callSheet.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Notes Preview */}
              {(callSheet.generalNotes || callSheet.safetyNotes) && (
                <div className="space-y-2">
                  {callSheet.safetyNotes && (
                    <div className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Safety Notes</p>
                        <p className="text-xs text-red-700 line-clamp-2">{callSheet.safetyNotes}</p>
                      </div>
                    </div>
                  )}
                  {callSheet.generalNotes && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">General Notes</p>
                      <p className="text-xs text-blue-700 line-clamp-2">{callSheet.generalNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PDF Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">PDF will include:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Production information
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Scene breakdown
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Location details
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Safety & general notes
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}