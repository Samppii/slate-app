"use client"

import { useState } from "react"
import { HeaderNav } from "@/components/layout/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, FileText, Mail, Copy, Filter, ChevronDown, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallSheets, useDuplicateCallSheet } from "@/lib/hooks/use-call-sheets"
import { useSafeUiStore } from "@/lib/stores/safe-store"
import { PDFExportDialog } from "@/components/call-sheets/pdf-export-dialog"
import { CallSheetStatus } from "@prisma/client"

export default function DashboardPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<'shootDate' | 'title' | 'status'>('shootDate')
  const [filterStatus, setFilterStatus] = useState<CallSheetStatus | 'all'>('all')
  const [selectedCallSheet, setSelectedCallSheet] = useState<any>(null)
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false)
  const { addNotification } = useSafeUiStore()

  // Fetch real call sheets data
  const { data: callSheetsData, isLoading, error } = useCallSheets({
    sortBy,
    sortOrder: 'desc',
    status: filterStatus === 'all' ? undefined : filterStatus,
    limit: 50
  })

  const duplicateMutation = useDuplicateCallSheet()

  const callSheets = callSheetsData?.callSheets || []

  const handleEdit = (id: string) => {
    router.push(`/builder/${id}`)
  }

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateMutation.mutateAsync(id)
      router.push(`/builder/${result.id}`)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleExportPDF = (callSheet: any) => {
    setSelectedCallSheet(callSheet)
    setIsPDFDialogOpen(true)
  }

  const handleEmail = (id: string) => {
    addNotification({
      type: 'info',
      title: 'Email Distribution',
      message: 'Email distribution feature coming soon!',
    })
  }

  const handleCreateNew = () => {
    router.push('/builder/new')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading call sheets...</span>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center text-red-600">
            <p>Failed to load call sheets: {error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Call Sheets</h1>
              <p className="text-muted-foreground">
                {callSheets.length} call sheet{callSheets.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select 
              value={sortBy} 
              onValueChange={(value: 'shootDate' | 'title' | 'status') => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shootDate">Shoot Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("DRAFT")}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("SENT")}>
                  Sent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ARCHIVED")}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {callSheets.map((sheet) => (
            <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{sheet.title}</CardTitle>
                  <Badge variant={sheet.status === "SENT" ? "default" : sheet.status === "DRAFT" ? "secondary" : "outline"}>
                    {sheet.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    📅 {new Date(sheet.shootDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    🕐 {sheet.callTime}
                  </p>
                  {sheet.location && (
                    <p className="text-sm text-muted-foreground truncate">
                      📍 {sheet.location}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(sheet.id)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleExportPDF(sheet)}
                    title="Export PDF"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEmail(sheet.id)}
                    title="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDuplicate(sheet.id)}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {selectedCallSheet && (
        <PDFExportDialog
          callSheet={selectedCallSheet}
          open={isPDFDialogOpen}
          onOpenChange={setIsPDFDialogOpen}
        />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleCreateNew}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          title="New Call Sheet"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}