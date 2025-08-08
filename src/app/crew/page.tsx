"use client"

import { useState } from "react"
import { HeaderNav } from "@/components/layout/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Filter } from "lucide-react"

interface CrewMember {
  id: string
  name: string
  role: string
  department: string
  defaultCallTime: string
  email: string
  phone: string
}

const departments = [
  "All Departments",
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

export default function CrewDirectoryPage() {
  const [crew, setCrew] = useState<CrewMember[]>([
    {
      id: "1",
      name: "John Doe",
      role: "Director",
      department: "Direction",
      defaultCallTime: "7:00 AM",
      email: "john@example.com",
      phone: "(555) 123-4567"
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Producer",
      department: "Production",
      defaultCallTime: "6:00 AM",
      email: "jane@example.com",
      phone: "(555) 234-5678"
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Director of Photography",
      department: "Camera",
      defaultCallTime: "7:00 AM",
      email: "mike@example.com",
      phone: "(555) 345-6789"
    }
  ])

  const [filterDepartment, setFilterDepartment] = useState("All Departments")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null)
  const [formData, setFormData] = useState<Omit<CrewMember, 'id'>>({
    name: "",
    role: "",
    department: "",
    defaultCallTime: "",
    email: "",
    phone: ""
  })

  const handleAdd = () => {
    setEditingCrew(null)
    setFormData({
      name: "",
      role: "",
      department: "",
      defaultCallTime: "",
      email: "",
      phone: ""
    })
    setModalOpen(true)
  }

  const handleEdit = (member: CrewMember) => {
    setEditingCrew(member)
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      defaultCallTime: member.defaultCallTime,
      email: member.email,
      phone: member.phone
    })
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setCrew(crew.filter(member => member.id !== id))
  }

  const handleSave = () => {
    if (editingCrew) {
      setCrew(crew.map(member => 
        member.id === editingCrew.id 
          ? { ...member, ...formData }
          : member
      ))
    } else {
      const newMember: CrewMember = {
        id: Date.now().toString(),
        ...formData
      }
      setCrew([...crew, newMember])
    }
    setModalOpen(false)
  }

  const filteredCrew = filterDepartment === "All Departments" 
    ? crew 
    : crew.filter(member => member.department === filterDepartment)

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Crew & Cast Directory</h1>
          
          <div className="flex items-center justify-between">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Person
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Default Call Time</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrew.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.defaultCallTime}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCrew ? "Edit Crew Member" : "Add New Crew Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.slice(1).map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="callTime">Default Call Time</Label>
              <Input
                id="callTime"
                type="time"
                value={formData.defaultCallTime}
                onChange={(e) => setFormData({ ...formData, defaultCallTime: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}