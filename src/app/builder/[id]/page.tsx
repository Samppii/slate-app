"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/layout/header-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Download } from "lucide-react"
import { GeneralInfoTab } from "@/components/builder/general-info-tab"
import { ScheduleTab } from "@/components/builder/schedule-tab"
import { CrewCastTab } from "@/components/builder/crew-cast-tab"
import { NotesTab } from "@/components/builder/notes-tab"
import { PreviewTab } from "@/components/builder/preview-tab"

export default function CallSheetBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const { id } = use(params)
  const isNew = id === "new"

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft...")
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">
              {isNew ? "New Call Sheet" : "Edit Call Sheet"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <TabsList className="flex-col h-full w-48 justify-start">
              <TabsTrigger value="general" className="w-full justify-start">
                General Info
              </TabsTrigger>
              <TabsTrigger value="schedule" className="w-full justify-start">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="crew" className="w-full justify-start">
                Crew / Cast
              </TabsTrigger>
              <TabsTrigger value="notes" className="w-full justify-start">
                Notes / Weather
              </TabsTrigger>
              <TabsTrigger value="preview" className="w-full justify-start">
                Preview PDF
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 ml-6">
              <TabsContent value="general">
                <GeneralInfoTab />
              </TabsContent>
              <TabsContent value="schedule">
                <ScheduleTab />
              </TabsContent>
              <TabsContent value="crew">
                <CrewCastTab />
              </TabsContent>
              <TabsContent value="notes">
                <NotesTab />
              </TabsContent>
              <TabsContent value="preview">
                <PreviewTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}