import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { callSheetsApi } from '@/lib/api-client'
import { CallSheetQuery, CreateCallSheetData, UpdateCallSheetData } from '@/lib/validations/call-sheet'
import { useSafeUiStore } from '@/lib/stores/safe-store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

// Query keys
export const callSheetKeys = {
  all: ['callSheets'] as const,
  lists: () => [...callSheetKeys.all, 'list'] as const,
  list: (params: CallSheetQuery) => [...callSheetKeys.lists(), params] as const,
  details: () => [...callSheetKeys.all, 'detail'] as const,
  detail: (id: string) => [...callSheetKeys.details(), id] as const,
}

// Get paginated call sheets
export function useCallSheets(params?: CallSheetQuery) {
  const { status } = useSession()
  const { addNotification } = useSafeUiStore()
  
  const queryParams: CallSheetQuery = {
    sortBy: 'shootDate',
    sortOrder: 'desc',
    ...params
  }
  
  const query = useQuery({
    queryKey: callSheetKeys.list(queryParams),
    queryFn: () => callSheetsApi.getCallSheets(queryParams),
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      addNotification({
        type: 'error',
        title: 'Failed to load call sheets',
        message: query.error.message,
      })
    }
  }, [query.error, addNotification])
  
  return query
}

// Get single call sheet
export function useCallSheet(id: string, enabled = true) {
  const { status } = useSession()
  const { addNotification } = useSafeUiStore()
  
  const query = useQuery({
    queryKey: callSheetKeys.detail(id),
    queryFn: () => callSheetsApi.getCallSheet(id),
    enabled: status === 'authenticated' && enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
  
  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      addNotification({
        type: 'error',
        title: 'Failed to load call sheet',
        message: query.error.message,
      })
    }
  }, [query.error, addNotification])
  
  return query
}

// Create call sheet
export function useCreateCallSheet() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: (data: CreateCallSheetData) => callSheetsApi.createCallSheet(data),
    onSuccess: (newCallSheet) => {
      // Invalidate and refetch call sheets list
      queryClient.invalidateQueries({ queryKey: callSheetKeys.lists() })
      
      addNotification({
        type: 'success',
        title: 'Call sheet created',
        message: `"${newCallSheet.title}" has been created successfully.`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create call sheet',
        message: error.message,
      })
    },
  })
}

// Update call sheet
export function useUpdateCallSheet() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCallSheetData }) =>
      callSheetsApi.updateCallSheet(id, data),
    onSuccess: (updatedCallSheet) => {
      // Update the specific call sheet in cache
      queryClient.setQueryData(
        callSheetKeys.detail(updatedCallSheet.id),
        updatedCallSheet
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: callSheetKeys.lists() })
      
      addNotification({
        type: 'success',
        title: 'Call sheet updated',
        message: `"${updatedCallSheet.title}" has been updated successfully.`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update call sheet',
        message: error.message,
      })
    },
  })
}

// Delete call sheet
export function useDeleteCallSheet() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: (id: string) => callSheetsApi.deleteCallSheet(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: callSheetKeys.detail(deletedId) })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: callSheetKeys.lists() })
      
      addNotification({
        type: 'success',
        title: 'Call sheet deleted',
        message: 'The call sheet has been deleted successfully.',
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete call sheet',
        message: error.message,
      })
    },
  })
}

// Duplicate call sheet
export function useDuplicateCallSheet() {
  const queryClient = useQueryClient()
  const { addNotification } = useSafeUiStore()
  
  return useMutation({
    mutationFn: (id: string) => callSheetsApi.duplicateCallSheet(id),
    onSuccess: (duplicatedCallSheet) => {
      // Invalidate lists to show the new call sheet
      queryClient.invalidateQueries({ queryKey: callSheetKeys.lists() })
      
      addNotification({
        type: 'success',
        title: 'Call sheet duplicated',
        message: `"${duplicatedCallSheet.title}" has been created as a copy.`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to duplicate call sheet',
        message: error.message,
      })
    },
  })
}

// Optimistic updates for better UX
export function useOptimisticCallSheetUpdate() {
  const queryClient = useQueryClient()
  
  const updateCallSheetOptimistic = (id: string, updates: Partial<UpdateCallSheetData>) => {
    queryClient.setQueryData(
      callSheetKeys.detail(id),
      (old: any) => old ? { ...old, ...updates } : old
    )
  }
  
  const revertCallSheetUpdate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: callSheetKeys.detail(id) })
  }
  
  return { updateCallSheetOptimistic, revertCallSheetUpdate }
}