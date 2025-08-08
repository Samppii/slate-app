"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCrewMemberSchema, UpdateCrewMemberData } from '@/lib/validations/crew-member'
import { useUpdateCrewMember, useDepartments, useRoles } from '@/lib/hooks/use-crew-members'
import { CrewMember } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EditCrewMemberDialogProps {
  member: CrewMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCrewMemberDialog({ 
  member, 
  open, 
  onOpenChange 
}: EditCrewMemberDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState(member.department)
  
  const updateMutation = useUpdateCrewMember()
  const { data: departmentsData } = useDepartments()
  const { data: rolesData } = useRoles(selectedDepartment)

  const form = useForm<UpdateCrewMemberData>({
    resolver: zodResolver(UpdateCrewMemberSchema),
    defaultValues: {
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email || '',
      phone: member.phone || '',
      notes: member.notes || '',
    },
  })

  // Reset form when member changes
  useEffect(() => {
    form.reset({
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email || '',
      phone: member.phone || '',
      notes: member.notes || '',
    })
    setSelectedDepartment(member.department)
  }, [member, form])

  const onSubmit = async (data: UpdateCrewMemberData) => {
    try {
      await updateMutation.mutateAsync({
        id: member.id,
        data
      })
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department)
    form.setValue('department', department)
    // Don't reset role when editing - let user keep it if valid
  }

  // Common departments for quick selection
  const commonDepartments = [
    'Camera',
    'Sound',
    'Lighting',
    'Art Direction',
    'Wardrobe',
    'Makeup/Hair',
    'Script',
    'Production',
    'Post-Production'
  ]

  // Common roles for quick selection
  const commonRoles = [
    'Director',
    'Producer',
    'Director of Photography',
    'Gaffer',
    'Key Grip',
    'Sound Mixer',
    'Script Supervisor',
    'Assistant Director',
    'Wardrobe Supervisor',
    'Makeup Artist'
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Crew Member</DialogTitle>
          <DialogDescription>
            Update {member.name}'s information in the crew directory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter crew member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleDepartmentChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type department" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Current department first if it's not in common list */}
                        {field.value && !commonDepartments.includes(field.value) && (
                          <SelectItem value={field.value}>
                            {field.value} (current)
                          </SelectItem>
                        )}
                        {commonDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        {departmentsData?.departments
                          .filter(dept => dept !== field.value && !commonDepartments.includes(dept))
                          .map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Department Input */}
            {!commonDepartments.includes(form.watch('department') || '') && 
             !departmentsData?.departments.includes(form.watch('department') || '') && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Department</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter custom department name" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setSelectedDepartment(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type role" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Current role first if it's not in available roles */}
                        {field.value && 
                         !rolesData?.roles.includes(field.value) && 
                         !commonRoles.includes(field.value) && (
                          <SelectItem value={field.value}>
                            {field.value} (current)
                          </SelectItem>
                        )}
                        
                        {/* Show roles from selected department first */}
                        {rolesData?.roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                        
                        {/* Show common roles */}
                        {commonRoles
                          .filter(role => !rolesData?.roles.includes(role))
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Role Input */}
            {!rolesData?.roles.includes(form.watch('role') || '') && 
             !commonRoles.includes(form.watch('role') || '') && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter custom role name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(555) 123-4567" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this crew member..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Crew Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}