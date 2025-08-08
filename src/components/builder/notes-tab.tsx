"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Cloud, CloudRain, Sun } from "lucide-react"

export function NotesTab() {
  const [notes, setNotes] = useState({
    customInstructions: "",
    equipment: "",
    transport: "",
    catering: ""
  })

  // Mock weather data - in production, this would come from a weather API
  const weatherData = {
    temperature: "72°F",
    condition: "Partly Cloudy",
    precipitation: "10%",
    wind: "5 mph"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Cloud className="h-12 w-12 text-blue-500" />
              <div>
                <p className="text-2xl font-semibold">{weatherData.temperature}</p>
                <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm">Precipitation: {weatherData.precipitation}</p>
              <p className="text-sm">Wind: {weatherData.wind}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-instructions">Custom Instructions</Label>
            <Textarea
              id="custom-instructions"
              placeholder="Add any special instructions for the crew..."
              value={notes.customInstructions}
              onChange={(e) => setNotes({ ...notes, customInstructions: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment Notes</Label>
            <Textarea
              id="equipment"
              placeholder="List special equipment requirements..."
              value={notes.equipment}
              onChange={(e) => setNotes({ ...notes, equipment: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport">Transportation</Label>
            <Textarea
              id="transport"
              placeholder="Transportation details and parking information..."
              value={notes.transport}
              onChange={(e) => setNotes({ ...notes, transport: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catering">Catering</Label>
            <Textarea
              id="catering"
              placeholder="Meal times and catering information..."
              value={notes.catering}
              onChange={(e) => setNotes({ ...notes, catering: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}