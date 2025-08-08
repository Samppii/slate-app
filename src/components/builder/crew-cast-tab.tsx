"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CrewMember {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
}

const departments = [
  "Production",
  "Direction",
  "Camera",
  "Lighting",
  "Sound",
  "Art Department",
  "Costume",
  "Makeup",
  "Post-Production"
]

// Mock data for existing crew members
const existingCrew = [
  { id: "1", name: "John Doe", role: "Director", department: "Direction" },
  { id: "2", name: "Jane Smith", role: "Producer", department: "Production" },
  { id: "3", name: "Mike Johnson", role: "DP", department: "Camera" },
  { id: "4", name: "Sarah Williams", role: "Gaffer", department: "Lighting" }
]

export function CrewCastTab() {
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [open, setOpen] = useState(false)
  const [selectedCrewId, setSelectedCrewId] = useState("")

  const addFromDirectory = () => {
    const selected = existingCrew.find(c => c.id === selectedCrewId)
    if (selected) {
      const newCrewMember: CrewMember = {
        id: Date.now().toString(),
        name: selected.name,
        role: selected.role,
        department: selected.department,
        email: "",
        phone: ""
      }
      setCrew([...crew, newCrewMember])
      setSelectedCrewId("")
    }
  }

  const addNewCrewMember = () => {
    const newCrewMember: CrewMember = {
      id: Date.now().toString(),
      name: "",
      role: "",
      department: "",
      email: "",
      phone: ""
    }
    setCrew([...crew, newCrewMember])
  }

  const removeCrewMember = (id: string) => {
    setCrew(crew.filter(member => member.id !== id))
  }

  const updateCrewMember = (id: string, field: keyof CrewMember, value: string) => {
    setCrew(crew.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crew & Cast</CardTitle>
        <div className="flex gap-2 mt-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between"
              >
                {selectedCrewId
                  ? existingCrew.find((crew) => crew.id === selectedCrewId)?.name
                  : "Select from directory..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search crew..." />
                <CommandEmpty>No crew member found.</CommandEmpty>
                <CommandGroup>
                  {existingCrew.map((crew) => (
                    <CommandItem
                      key={crew.id}
                      value={crew.id}
                      onSelect={(currentValue) => {
                        setSelectedCrewId(currentValue === selectedCrewId ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCrewId === crew.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {crew.name} - {crew.role}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={addFromDirectory} disabled={!selectedCrewId}>
            Add Selected
          </Button>
          <Button onClick={addNewCrewMember} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {crew.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crew.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Input
                      value={member.name}
                      onChange={(e) => updateCrewMember(member.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.role}
                      onChange={(e) => updateCrewMember(member.id, 'role', e.target.value)}
                      placeholder="Role"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.department}
                      onValueChange={(value) => updateCrewMember(member.id, 'department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="email"
                      value={member.email}
                      onChange={(e) => updateCrewMember(member.id, 'email', e.target.value)}
                      placeholder="Email"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => updateCrewMember(member.id, 'phone', e.target.value)}
                      placeholder="Phone"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCrewMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No crew members added yet. Add from directory or create new.
          </div>
        )}
      </CardContent>
    </Card>
  )
}