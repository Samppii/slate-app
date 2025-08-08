"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateCallSheetData, UpdateCallSheetData } from "@/lib/validations/call-sheet"

interface CrewCastTabProps {
  form: UseFormReturn<CreateCallSheetData | UpdateCallSheetData>
}

export function CrewCastTab({ form }: CrewCastTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crew & Cast Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Crew and cast assignment functionality will be implemented in the next version.
          For now, crew members can be managed through the dedicated crew directory.
        </p>
      </CardContent>
    </Card>
  )
}