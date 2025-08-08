"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateCallSheetData, UpdateCallSheetData } from "@/lib/validations/call-sheet"

interface ScheduleTabProps {
  form: UseFormReturn<CreateCallSheetData | UpdateCallSheetData>
}

export function ScheduleTab({ form }: ScheduleTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scene Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Scene scheduling functionality will be implemented in the next version. 
          For now, you can add scene information in the preview section.
        </p>
      </CardContent>
    </Card>
  )
}