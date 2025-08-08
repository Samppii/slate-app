"use client"

import { UseFormReturn, Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { CreateCallSheetData, UpdateCallSheetData } from "@/lib/validations/call-sheet"

interface GeneralInfoTabProps {
  form: UseFormReturn<CreateCallSheetData | UpdateCallSheetData>
}

export function GeneralInfoTab({ form }: GeneralInfoTabProps) {
  const { control, formState: { errors } } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Production Title *</Label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input 
                id="title"
                placeholder="Enter production title" 
                {...field}
              />
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type</Label>
          <Controller
            control={control}
            name="projectType"
            render={({ field }) => (
              <Input 
                id="projectType"
                placeholder="Feature Film, TV Series, Commercial, etc." 
                {...field}
              />
            )}
          />
          {errors.projectType && (
            <p className="text-sm text-red-600">{errors.projectType.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="shootDate">Shoot Date *</Label>
            <Controller
              control={control}
              name="shootDate"
              render={({ field }) => (
                <Input
                  id="shootDate"
                  type="date"
                  {...field}
                />
              )}
            />
            {errors.shootDate && (
              <p className="text-sm text-red-600">{errors.shootDate.message}</p>
            )}
          </div>

          {/* Call Time */}
          <div className="space-y-2">
            <Label htmlFor="callTime">Call Time *</Label>
            <Controller
              control={control}
              name="callTime"
              render={({ field }) => (
                <Input
                  id="callTime"
                  type="time"
                  placeholder="07:00"
                  {...field}
                />
              )}
            />
            {errors.callTime && (
              <p className="text-sm text-red-600">{errors.callTime.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Primary Location *</Label>
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter primary shooting location"
                  className="pl-10"
                  {...field}
                />
              </div>
            )}
          />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Map Link */}
        <div className="space-y-2">
          <Label htmlFor="mapLink">Google Maps Link</Label>
          <Controller
            control={control}
            name="mapLink"
            render={({ field }) => (
              <Input
                id="mapLink"
                type="url"
                placeholder="https://maps.google.com/?q=..."
                {...field}
              />
            )}
          />
          {errors.mapLink && (
            <p className="text-sm text-red-600">{errors.mapLink.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Sunrise */}
          <div className="space-y-2">
            <Label htmlFor="sunrise">Sunrise</Label>
            <Controller
              control={control}
              name="sunrise"
              render={({ field }) => (
                <Input
                  id="sunrise"
                  type="time"
                  placeholder="06:30"
                  {...field}
                />
              )}
            />
            {errors.sunrise && (
              <p className="text-sm text-red-600">{errors.sunrise.message}</p>
            )}
          </div>

          {/* Sunset */}
          <div className="space-y-2">
            <Label htmlFor="sunset">Sunset</Label>
            <Controller
              control={control}
              name="sunset"
              render={({ field }) => (
                <Input
                  id="sunset"
                  type="time"
                  placeholder="19:30"
                  {...field}
                />
              )}
            />
            {errors.sunset && (
              <p className="text-sm text-red-600">{errors.sunset.message}</p>
            )}
          </div>
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <Label htmlFor="weather">Weather Forecast</Label>
          <Controller
            control={control}
            name="weather"
            render={({ field }) => (
              <Input
                id="weather"
                placeholder="Sunny, 75°F with light breeze"
                {...field}
              />
            )}
          />
          {errors.weather && (
            <p className="text-sm text-red-600">{errors.weather.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}