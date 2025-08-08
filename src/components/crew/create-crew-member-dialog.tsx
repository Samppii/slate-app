"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCrewMemberSchema, CreateCrewMemberData } from '@/lib/validations/crew-member'
import { useCreateCrewMember, useDepartments, useRoles } from '@/lib/hooks/use-crew-members'
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

interface CreateCrewMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCrewMemberDialog({ open, onOpenChange }: CreateCrewMemberDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  
  const createMutation = useCreateCrewMember()
  const { data: departmentsData } = useDepartments()
  const { data: rolesData } = useRoles(selectedDepartment)

  const form = useForm<CreateCrewMemberData>({
    resolver: zodResolver(CreateCrewMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      notes: '',
    },
  })

  const onSubmit = async (data: CreateCrewMemberData) => {
    try {
      await createMutation.mutateAsync(data)
      form.reset()
      setSelectedDepartment('')
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department)
    form.setValue('department', department)
    form.setValue('role', '') // Reset role when department changes
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

  // Common roles for quick selection (when no department selected)
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
          <DialogTitle>Add Crew Member</DialogTitle>
          <DialogDescription>
            Add a new crew member to your production directory.
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
                        {commonDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        {departmentsData?.departments.map((dept) => 
                          !commonDepartments.includes(dept) && (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Department Input */}
            {!commonDepartments.includes(form.watch('department')) && 
             !departmentsData?.departments.includes(form.watch('department')) && (
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
                        {/* Show roles from selected department first */}
                        {rolesData?.roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                        
                        {/* Show common roles if no department selected */}
                        {!selectedDepartment && commonRoles.map((role) => (
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
            {!rolesData?.roles.includes(form.watch('role')) && 
             !commonRoles.includes(form.watch('role')) && (
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Adding...' : 'Add Crew Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}