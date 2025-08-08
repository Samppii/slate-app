import { z } from 'zod'

export const CreateCrewMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.string().min(1, 'Role is required').max(100, 'Role too long'),
  department: z.string().min(1, 'Department is required').max(50, 'Department too long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number too long').optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes too long').optional().or(z.literal('')),
})

export const UpdateCrewMemberSchema = CreateCrewMemberSchema.partial()

export const CrewMemberQuerySchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  sortBy: z.enum(['name', 'role', 'department', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
})

export type CreateCrewMemberData = z.infer<typeof CreateCrewMemberSchema>
export type UpdateCrewMemberData = z.infer<typeof UpdateCrewMemberSchema>
export type CrewMemberQuery = z.infer<typeof CrewMemberQuerySchema>