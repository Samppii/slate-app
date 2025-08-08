"use client"

import { useState } from 'react'
import { HeaderNav } from "@/components/layout/header-nav"
import { CrewDirectory } from '@/components/crew/crew-directory'
import { CreateCrewMemberDialog } from '@/components/crew/create-crew-member-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CrewPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crew Directory</h1>
            <p className="text-muted-foreground">
              Manage your production crew members and contact information
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Crew Member
          </Button>
        </div>
        
        <CrewDirectory />
        
        <CreateCrewMemberDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </div>
  )
}