import { 
  User, 
  CallSheet, 
  CrewMember, 
  Scene, 
  Template, 
  CallSheetCrew,
  UserRole,
  CallSheetStatus
} from '@prisma/client'

// Extended types with relations
export type CallSheetWithRelations = CallSheet & {
  createdBy: {
    id: string
    name: string | null
    email: string
  }
  scenes: Scene[]
  callSheetCrew: (CallSheetCrew & {
    crewMember: {
      id: string
      name: string
      email: string | null
      phone: string | null
      department: string
      role: string
    }
  })[]
}

export type CrewMemberWithCallSheets = CrewMember & {
  createdBy: User
  callSheets: (CallSheetCrew & {
    callSheet: CallSheet
  })[]
}

export type TemplateWithUser = Template & {
  createdBy: User
}

// Form data types
export interface CallSheetFormData {
  title: string
  shootDate: Date
  callTime: string
  location: string
  mapLink?: string
  projectType?: string
  weather?: string
  sunrise?: string
  sunset?: string
  generalNotes?: string
  safetyNotes?: string
  scenes: SceneFormData[]
  crewMembers: string[] // Array of crew member IDs
}

export interface SceneFormData {
  sceneNumber: string
  description?: string
  location?: string
  timeOfDay?: string
  pages?: number
  estimatedTime?: string
  notes?: string
}

export interface CrewMemberFormData {
  name: string
  email?: string
  phone?: string
  department: string
  position: string
  union?: string
  rate?: number
  notes?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Filter and search types
export interface CallSheetFilters {
  status?: CallSheetStatus
  projectType?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

export interface CrewMemberFilters {
  department?: string
  union?: string
  search?: string
}

// Export Prisma types
export type {
  User,
  CallSheet,
  CrewMember,
  Scene,
  Template,
  CallSheetCrew,
  UserRole,
  CallSheetStatus
}