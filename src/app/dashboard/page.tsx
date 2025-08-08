"use client"

import { useState } from "react"
import { HeaderNav } from "@/components/layout/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, FileText, Mail, Copy, Filter, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface CallSheet {
  id: string
  title: string
  date: string
  projectType: string
  status: "draft" | "sent"
}

export default function DashboardPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("date")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data - replace with actual API call
  const callSheets: CallSheet[] = [
    {
      id: "1",
      title: "Project Alpha - Day 1",
      date: "2024-01-15",
      projectType: "Feature Film",
      status: "sent"
    },
    {
      id: "2",
      title: "Commercial Shoot - Nike",
      date: "2024-01-18",
      projectType: "Commercial",
      status: "draft"
    },
    {
      id: "3",
      title: "Music Video - Artist X",
      date: "2024-01-20",
      projectType: "Music Video",
      status: "sent"
    },
    {
      id: "4",
      title: "TV Series - Episode 3",
      date: "2024-01-22",
      projectType: "TV Series",
      status: "draft"
    }
  ]

  const handleEdit = (id: string) => {
    router.push(`/builder/${id}`)
  }

  const handleDuplicate = (id: string) => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate:", id)
  }

  const handleExportPDF = (id: string) => {
    // TODO: Implement PDF export
    console.log("Export PDF:", id)
  }

  const handleEmail = (id: string) => {
    // TODO: Implement email functionality
    console.log("Email:", id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Call Sheets</h1>
          
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("sent")}>
                  Sent
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
                  <Badge variant={sheet.status === "sent" ? "default" : "secondary"}>
                    {sheet.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">{sheet.projectType}</Badge>
                  <p className="text-sm text-muted-foreground">{sheet.date}</p>
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
                    onClick={() => handleExportPDF(sheet.id)}
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
    </div>
  )
}