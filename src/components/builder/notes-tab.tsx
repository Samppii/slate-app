"use client"

import { UseFormReturn, Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, FileText } from "lucide-react"
import { CreateCallSheetData, UpdateCallSheetData } from "@/lib/validations/call-sheet"

interface NotesTabProps {
  form: UseFormReturn<CreateCallSheetData | UpdateCallSheetData>
}

export function NotesTab({ form }: NotesTabProps) {
  const { control, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Safety Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="safetyNotes">Safety Information & Protocols</Label>
            <Controller
              control={control}
              name="safetyNotes"
              render={({ field }) => (
                <Textarea
                  id="safetyNotes"
                  placeholder="Include safety protocols, hazard warnings, emergency contacts, and any special safety equipment required..."
                  className="min-h-[120px]"
                  {...field}
                />
              )}
            />
            {errors.safetyNotes && (
              <p className="text-sm text-red-600">{errors.safetyNotes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            General Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="generalNotes">Production Notes & Instructions</Label>
            <Controller
              control={control}
              name="generalNotes"
              render={({ field }) => (
                <Textarea
                  id="generalNotes"
                  placeholder="Include general information, special instructions, equipment notes, catering details, transportation info, parking instructions, etc..."
                  className="min-h-[200px]"
                  {...field}
                />
              )}
            />
            {errors.generalNotes && (
              <p className="text-sm text-red-600">{errors.generalNotes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}