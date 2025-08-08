import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crewApi } from '@/lib/api-client'
import { CrewMemberQuery, CreateCrewMemberData, UpdateCrewMemberData } from '@/lib/validations/crew-member'
import { useSafeUiStore } from '@/lib/stores/safe-store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

// Query keys
export const crewMemberKeys = {
  all: ['crewMembers'] as const,
  lists: () => [...crewMemberKeys.all, 'list'] as const,
  list: (params: CrewMemberQuery) => [...crewMemberKeys.lists(), params] as const,
  details: () => [...crewMemberKeys.all, 'detail'] as const,
  detail: (id: string) => [...crewMemberKeys.details(), id] as const,
  departments: () => [...crewMemberKeys.all, 'departments'] as const,
  roles: (department?: string) => [...crewMemberKeys.all, 'roles', department] as const,
}

// Get paginated crew members
export function useCrewMembers(params?: CrewMemberQuery) {
  const { status } = useSession()
  const { addNotification } = useSafeUiStore()
  
  const queryParams: CrewMemberQuery = {
    sortBy: 'name',
    sortOrder: 'asc',
    ...params
  }
  
  const query = useQuery({
    queryKey: crewMemberKeys.list(queryParams),
    queryFn: () => crewApi.getCrewMembers(queryParams),
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      addNotification({
        type: 'error',
        title: 'Failed to load crew members',
        message: query.error.message,
      })
    }
  }, [query.error, addNotification])
  
  return query
}

// Get single crew member
export function useCrewMember(id: string, enabled = true) {
  const { status } = useSession()
  const { addNotification } = useSafeUiStore()
  
  const query = useQuery({
    queryKey: crewMemberKeys.detail(id),
    queryFn: () => crewApi.getCrewMember(id),
    enabled: status === 'authenticated' && enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
  
  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      addNotification({
        type: 'error',
        title: 'Failed to load crew member',
        message: query.error.message,
      })
    }
  }, [query.error, addNotification])
  
  return query
}

// Get departments
export function useDepartments() {
  const { status } = useSession()
  
  return useQuery({
    queryKey: crewMemberKeys.departments(),
    queryFn: () => crewApi.getDepartments(),
    enabled: status === 'authenticated',
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get roles
export function useRoles(department?: string) {
  const { status } = useSession()
  
  return useQuery({
    queryKey: crewMemberKeys.roles(department),
    queryFn: () => crewApi.getRoles(department),
    enabled: status === 'authenticated',
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create crew member
export function useCreateCrewMember() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: (data: CreateCrewMemberData) => crewApi.createCrewMember(data),
    onSuccess: (newCrewMember) => {
      // Invalidate and refetch crew members list
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.lists() })
      
      // Invalidate departments and roles to include new ones
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.departments() })
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.all.concat(['roles']) })
      
      addNotification({
        type: 'success',
        title: 'Crew member added',
        message: `${newCrewMember.name} has been added to the crew directory.`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to add crew member',
        message: error.message,
      })
    },
  })
}

// Update crew member
export function useUpdateCrewMember() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCrewMemberData }) =>
      crewApi.updateCrewMember(id, data),
    onSuccess: (updatedCrewMember) => {
      // Update the specific crew member in cache
      queryClient.setQueryData(
        crewMemberKeys.detail(updatedCrewMember.id),
        updatedCrewMember
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.lists() })
      
      // Invalidate departments and roles in case they changed
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.departments() })
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.all.concat(['roles']) })
      
      addNotification({
        type: 'success',
        title: 'Crew member updated',
        message: `${updatedCrewMember.name}'s information has been updated.`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update crew member',
        message: error.message,
      })
    },
  })
}

// Delete crew member
export function useDeleteCrewMember() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: (id: string) => crewApi.deleteCrewMember(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: crewMemberKeys.detail(deletedId) })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.lists() })
      
      // Optionally invalidate departments and roles if this was the last member in a department/role
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.departments() })
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.all.concat(['roles']) })
      
      addNotification({
        type: 'success',
        title: 'Crew member removed',
        message: 'The crew member has been removed from the directory.',
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to remove crew member',
        message: error.message,
      })
    },
  })
}

// Bulk operations
export function useBulkDeleteCrewMembers() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete crew members in parallel
      await Promise.all(ids.map(id => crewApi.deleteCrewMember(id)))
      return ids
    },
    onSuccess: (deletedIds) => {
      // Remove from cache
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: crewMemberKeys.detail(id) })
      })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.lists() })
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.departments() })
      queryClient.invalidateQueries({ queryKey: crewMemberKeys.all.concat(['roles']) })
      
      addNotification({
        type: 'success',
        title: 'Crew members removed',
        message: `${deletedIds.length} crew member(s) have been removed.`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to remove crew members',
        message: error.message,
      })
    },
  })
}