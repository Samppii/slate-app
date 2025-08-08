import { z } from 'zod'

// Scene validation schema
export const sceneSchema = z.object({
  id: z.string().optional(), // For updates
  sceneNumber: z.string().min(1, 'Scene number is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  timeOfDay: z.enum(['Day', 'Night', 'Dawn', 'Dusk']).optional(),
  pages: z.number().min(0).optional(),
  estimatedTime: z.string().optional(),
  notes: z.string().optional(),
})

// Call sheet creation schema
export const createCallSheetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  shootDate: z.string().transform((date) => new Date(date)),
  callTime: z.string().min(1, 'Call time is required'),
  location: z.string().min(1, 'Location is required').max(500, 'Location too long'),
  mapLink: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'Invalid map link format'
  }),
  projectType: z.string().optional(),
  weather: z.string().max(100, 'Weather description too long').optional(),
  sunrise: z.string().optional(),
  sunset: z.string().optional(),
  generalNotes: z.string().max(2000, 'General notes too long').optional(),
  safetyNotes: z.string().max(2000, 'Safety notes too long').optional(),
  scenes: z.array(sceneSchema).default([]),
  crewMemberIds: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'SENT', 'ARCHIVED']).optional(),
})

// Call sheet update schema (all fields optional)
export const updateCallSheetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  shootDate: z.string().transform((date) => new Date(date)).optional(),
  callTime: z.string().min(1, 'Call time is required').optional(),
  location: z.string().min(1, 'Location is required').max(500, 'Location too long').optional(),
  mapLink: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'Invalid map link format'
  }),
  projectType: z.string().optional(),
  weather: z.string().max(100, 'Weather description too long').optional(),
  sunrise: z.string().optional(),
  sunset: z.string().optional(),
  generalNotes: z.string().max(2000, 'General notes too long').optional(),
  safetyNotes: z.string().max(2000, 'Safety notes too long').optional(),
  status: z.enum(['DRAFT', 'SENT', 'ARCHIVED']).optional(),
  scenes: z.array(sceneSchema).optional(),
  crewMemberIds: z.array(z.string()).optional(),
})

// Query parameters for listing call sheets
export const callSheetQuerySchema = z.object({
  page: z.string().nullable().transform((p) => parseInt(p || '1') || 1).optional(),
  limit: z.string().nullable().transform((l) => Math.min(parseInt(l || '10') || 10, 50)).optional(),
  status: z.enum(['DRAFT', 'SENT', 'ARCHIVED']).nullable().optional(),
  projectType: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  sortBy: z.enum(['title', 'shootDate', 'createdAt', 'status']).default('shootDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateCallSheetData = z.infer<typeof createCallSheetSchema>
export type UpdateCallSheetData = z.infer<typeof updateCallSheetSchema>
export type CallSheetQuery = z.infer<typeof callSheetQuerySchema>