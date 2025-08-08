import { CallSheetQuery, CreateCallSheetData, UpdateCallSheetData } from '@/lib/validations/call-sheet'
import { CrewMemberQuery, CreateCrewMemberData, UpdateCrewMemberData } from '@/lib/validations/crew-member'
import { CallSheetWithRelations } from '@/lib/types/database'
import { CrewMember } from '@prisma/client'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Generic API response type
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: any
}

// Generic API client
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || data
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Call Sheets API
export const callSheetsApi = {
  // Get paginated list of call sheets
  getCallSheets: (params?: CallSheetQuery) => {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.projectType) searchParams.set('projectType', params.projectType)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    
    const queryString = searchParams.toString()
    const endpoint = `/call-sheets${queryString ? `?${queryString}` : ''}`
    
    return apiClient.get<{
      callSheets: CallSheetWithRelations[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }>(endpoint)
  },

  // Get single call sheet
  getCallSheet: (id: string) =>
    apiClient.get<CallSheetWithRelations>(`/call-sheets/${id}`),

  // Create new call sheet
  createCallSheet: (data: CreateCallSheetData) =>
    apiClient.post<CallSheetWithRelations>('/call-sheets', data),

  // Update call sheet
  updateCallSheet: (id: string, data: UpdateCallSheetData) =>
    apiClient.put<CallSheetWithRelations>(`/call-sheets/${id}`, data),

  // Delete call sheet
  deleteCallSheet: (id: string) =>
    apiClient.delete<{ message: string }>(`/call-sheets/${id}`),

  // Duplicate call sheet
  duplicateCallSheet: (id: string) =>
    apiClient.post<CallSheetWithRelations>(`/call-sheets/${id}/duplicate`),
}

// Crew Members API
export const crewApi = {
  // Get paginated list of crew members
  getCrewMembers: (params?: CrewMemberQuery) => {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.department) searchParams.set('department', params.department)
    if (params?.role) searchParams.set('role', params.role)
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    
    const queryString = searchParams.toString()
    const endpoint = `/crew-members${queryString ? `?${queryString}` : ''}`
    
    return apiClient.get<{
      crewMembers: CrewMember[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(endpoint)
  },

  // Get single crew member
  getCrewMember: (id: string) =>
    apiClient.get<CrewMember>(`/crew-members/${id}`),

  // Create new crew member
  createCrewMember: (data: CreateCrewMemberData) =>
    apiClient.post<CrewMember>('/crew-members', data),

  // Update crew member
  updateCrewMember: (id: string, data: UpdateCrewMemberData) =>
    apiClient.put<CrewMember>(`/crew-members/${id}`, data),

  // Delete crew member
  deleteCrewMember: (id: string) =>
    apiClient.delete<{ message: string }>(`/crew-members/${id}`),

  // Get departments
  getDepartments: () =>
    apiClient.get<{ departments: string[] }>('/crew-members/departments'),

  // Get roles (optionally filtered by department)
  getRoles: (department?: string) => {
    const endpoint = department 
      ? `/crew-members/roles?department=${encodeURIComponent(department)}`
      : '/crew-members/roles'
    return apiClient.get<{ roles: string[] }>(endpoint)
  },
}

// Templates API (placeholder for future implementation)
export const templatesApi = {
  // TODO: Implement templates API calls
  getTemplates: () => Promise.resolve([]),
  getTemplate: (id: string) => Promise.resolve(null),
  createTemplate: (data: any) => Promise.resolve(null),
}