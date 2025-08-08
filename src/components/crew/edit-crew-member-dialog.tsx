"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  const [showCustomDepartment, setShowCustomDepartment] = useState(false)
  const [showCustomRole, setShowCustomRole] = useState(false)
  
  // Don't render anything if dialog is not open
  if (!open) {
    return null
  }
  
  const updateMutation = useUpdateCrewMember()
  const { data: departmentsData } = useDepartments()
  const { data: rolesData } = useRoles(selectedDepartment)

  const form = useForm<UpdateCrewMemberData & { customDepartment?: string; customRole?: string }>({
    resolver: zodResolver(UpdateCrewMemberSchema.extend({
      customDepartment: z.string().optional(),
      customRole: z.string().optional(),
    })),
    defaultValues: {
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email || '',
      phone: member.phone || '',
      notes: member.notes || '',
      customDepartment: '',
      customRole: '',
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
      customDepartment: '',
      customRole: '',
    })
    setSelectedDepartment(member.department)
  }, [member, form])

  const onSubmit = async (data: UpdateCrewMemberData & { customDepartment?: string; customRole?: string }) => {
    try {
      // Remove the custom fields from the final data since we now directly use the main fields
      const { customDepartment, customRole, ...finalData } = data

      await updateMutation.mutateAsync({
        id: member.id,
        data: finalData
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
            {!showCustomDepartment && (
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
                          <SelectItem key={`current-dept-${field.value}`} value={field.value}>
                            {field.value} (current)
                          </SelectItem>
                        )}
                        {commonDepartments.map((dept, index) => (
                          <SelectItem key={`common-dept-${index}-${dept}`} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        {departmentsData?.departments
                          .filter(dept => dept !== field.value && !commonDepartments.includes(dept))
                          .map((dept, index) => (
                            <SelectItem key={`dept-${index}-${dept}`} value={dept}>
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
            )}

            {/* Custom Department Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Need a custom department?</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomDepartment(!showCustomDepartment)
                  if (!showCustomDepartment) {
                    form.setValue('department', '')
                    setSelectedDepartment('')
                  }
                }}
              >
                {showCustomDepartment ? 'Select from list' : 'Add custom department'}
              </Button>
            </div>

            {/* Custom Department Input */}
            {showCustomDepartment && (
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
                          field.onChange(e.target.value)
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
            {!showCustomRole && (
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
                        {/* Get all unique roles */}
                        {(() => {
                          const allRoles = new Set()
                          const roleItems = []
                          
                          // Add current role first if it exists and is not empty
                          if (field.value && field.value.trim()) {
                            allRoles.add(field.value)
                            roleItems.push(
                              <SelectItem key={`current-role-${field.value}`} value={field.value}>
                                {field.value} {!rolesData?.roles.includes(field.value) && !commonRoles.includes(field.value) ? '(current)' : ''}
                              </SelectItem>
                            )
                          }
                          
                          // Add department roles
                          rolesData?.roles?.forEach((role, index) => {
                            if (!allRoles.has(role)) {
                              allRoles.add(role)
                              roleItems.push(
                                <SelectItem key={`dept-role-${index}-${role}`} value={role}>
                                  {role}
                                </SelectItem>
                              )
                            }
                          })
                          
                          // Add common roles
                          commonRoles.forEach((role, index) => {
                            if (!allRoles.has(role)) {
                              allRoles.add(role)
                              roleItems.push(
                                <SelectItem key={`common-role-${index}-${role}`} value={role}>
                                  {role}
                                </SelectItem>
                              )
                            }
                          })
                          
                          return roleItems
                        })()}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}

            {/* Custom Role Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Need a custom role?</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomRole(!showCustomRole)
                  if (!showCustomRole) {
                    form.setValue('role', '')
                  }
                }}
              >
                {showCustomRole ? 'Select from list' : 'Add custom role'}
              </Button>
            </div>

            {/* Custom Role Input */}
            {showCustomRole && (
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