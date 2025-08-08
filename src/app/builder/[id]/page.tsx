"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { HeaderNav } from "@/components/layout/header-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form } from "@/components/ui/form"
import { ArrowLeft, Save, Download, Trash2 } from "lucide-react"
import { GeneralInfoTab } from "@/components/builder/general-info-tab"
import { ScheduleTab } from "@/components/builder/schedule-tab"
import { CrewCastTab } from "@/components/builder/crew-cast-tab"
import { NotesTab } from "@/components/builder/notes-tab"
import { PreviewTab } from "@/components/builder/preview-tab"
import { useCallSheet, useCreateCallSheet, useUpdateCallSheet, useDeleteCallSheet } from "@/lib/hooks/use-call-sheets"
import { createCallSheetSchema, updateCallSheetSchema, CreateCallSheetData, UpdateCallSheetData } from "@/lib/validations/call-sheet"
import { useSafeUiStore } from "@/lib/stores/safe-store"
import { PDFExportDialog } from "@/components/call-sheets/pdf-export-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CallSheetBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { id } = use(params)
  const isNew = id === "new"
  const { addNotification } = useSafeUiStore()

  // Fetch existing call sheet if editing
  const { data: callSheet, isLoading, error } = useCallSheet(id, !isNew)
  
  // Mutations
  const createMutation = useCreateCallSheet()
  const updateMutation = useUpdateCallSheet()
  const deleteMutation = useDeleteCallSheet()

  // Form setup
  const form = useForm<CreateCallSheetData | UpdateCallSheetData>({
    resolver: zodResolver(isNew ? createCallSheetSchema : updateCallSheetSchema),
    defaultValues: {
      title: '',
      shootDate: '',
      callTime: '',
      location: '',
      mapLink: '',
      projectType: '',
      weather: '',
      sunrise: '',
      sunset: '',
      generalNotes: '',
      safetyNotes: '',
      scenes: [],
      crewMemberIds: [],
    },
  })

  // Load call sheet data into form when editing
  useEffect(() => {
    if (callSheet && !isNew) {
      form.reset({
        title: callSheet.title,
        shootDate: new Date(callSheet.shootDate).toISOString().split('T')[0],
        callTime: callSheet.callTime,
        location: callSheet.location,
        mapLink: callSheet.mapLink || '',
        projectType: callSheet.projectType || '',
        weather: callSheet.weather || '',
        sunrise: callSheet.sunrise || '',
        sunset: callSheet.sunset || '',
        generalNotes: callSheet.generalNotes || '',
        safetyNotes: callSheet.safetyNotes || '',
        scenes: callSheet.scenes || [],
        crewMemberIds: callSheet.callSheetCrew?.map(csc => csc.crewMember.id) || [],
      })
    }
  }, [callSheet, isNew, form])

  const handleSaveDraft = async () => {
    const formData = form.getValues()
    
    try {
      if (isNew) {
        const result = await createMutation.mutateAsync(formData as CreateCallSheetData)
        router.push(`/builder/${result.id}`)
      } else {
        await updateMutation.mutateAsync({ 
          id, 
          data: { ...formData, status: 'DRAFT' } as UpdateCallSheetData 
        })
      }
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handlePublish = async () => {
    const formData = form.getValues()
    
    try {
      if (isNew) {
        const result = await createMutation.mutateAsync({
          ...formData as CreateCallSheetData,
          status: 'SENT'
        })
        router.push(`/builder/${result.id}`)
      } else {
        await updateMutation.mutateAsync({ 
          id, 
          data: { ...formData, status: 'SENT' } as UpdateCallSheetData 
        })
      }
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDelete = async () => {
    if (!isNew) {
      try {
        await deleteMutation.mutateAsync(id)
        router.push('/dashboard')
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  const handleExport = () => {
    if (!isNew && callSheet) {
      setIsPDFDialogOpen(true)
    } else {
      addNotification({
        type: 'warning',
        title: 'Save Required',
        message: 'Please save the call sheet before exporting.',
      })
    }
  }

  // Loading state
  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading call sheet...</div>
      </div>
    )
  }

  // Error state
  if (error && !isNew) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Failed to load call sheet: {error.message}</div>
      </div>
    )
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
            <div>
              <h1 className="text-xl font-semibold">
                {isNew ? "New Call Sheet" : callSheet?.title || "Edit Call Sheet"}
              </h1>
              {callSheet && (
                <p className="text-sm text-muted-foreground">
                  Status: {callSheet.status} • Created {new Date(callSheet.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isNew && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isNew ? 'Create & Publish' : 'Publish'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={isNew}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Form {...form}>
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
                  <GeneralInfoTab form={form} />
                </TabsContent>
                <TabsContent value="schedule">
                  <ScheduleTab form={form} />
                </TabsContent>
                <TabsContent value="crew">
                  <CrewCastTab form={form} />
                </TabsContent>
                <TabsContent value="notes">
                  <NotesTab form={form} />
                </TabsContent>
                <TabsContent value="preview">
                  <PreviewTab callSheet={callSheet} form={form} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </Form>
      </div>

      {/* PDF Export Dialog */}
      {callSheet && (
        <PDFExportDialog
          callSheet={callSheet}
          open={isPDFDialogOpen}
          onOpenChange={setIsPDFDialogOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Call Sheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this call sheet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}