"use client"

import { useEffect, useState, useMemo } from 'react'
import { CallSheetStatus } from '@prisma/client'

// Safe store implementation that doesn't use Zustand during SSR
let storeModule: any = null

// Initialize store only on client
if (typeof window !== 'undefined') {
  import('./app-store').then((module) => {
    storeModule = module
  })
}

// Default values for SSR
const defaultUiState = {
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  modals: {
    createCallSheet: false,
    editCallSheet: false,
    deleteCallSheet: false,
    exportPdf: false,
  },
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {},
  isLoading: {
    global: false,
    callSheets: false,
    crew: false,
    export: false,
  },
  setLoading: () => {},
  notifications: [] as Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    timestamp: number
  }>,
  addNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
}

const defaultFiltersState = {
  callSheets: {
    sortBy: 'shootDate' as const,
    sortOrder: 'desc' as const,
    page: 1,
    limit: 12,
  },
  setCallSheetFilters: () => {},
  resetCallSheetFilters: () => {},
}

const defaultPreferencesState = {
  theme: 'system' as const,
  setTheme: () => {},
  defaultCallTime: '07:00',
  defaultDepartments: ['Camera', 'Sound', 'Art', 'Wardrobe', 'Grip', 'Electric'],
  setDefaultCallTime: () => {},
  setDefaultDepartments: () => {},
  dashboardView: 'grid' as const,
  setDashboardView: () => {},
}

// Cached selectors to prevent recreation
const uiSelector = (state: any) => ({
  sidebarCollapsed: state.sidebarCollapsed,
  setSidebarCollapsed: state.setSidebarCollapsed,
  modals: state.modals,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals,
  isLoading: state.isLoading,
  setLoading: state.setLoading,
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
})

const filtersSelector = (state: any) => ({
  callSheets: state.callSheets,
  setCallSheetFilters: state.setCallSheetFilters,
  resetCallSheetFilters: state.resetCallSheetFilters,
})

const preferencesSelector = (state: any) => ({
  theme: state.theme,
  setTheme: state.setTheme,
  defaultCallTime: state.defaultCallTime,
  defaultDepartments: state.defaultDepartments,
  setDefaultCallTime: state.setDefaultCallTime,
  setDefaultDepartments: state.setDefaultDepartments,
  dashboardView: state.dashboardView,
  setDashboardView: state.setDashboardView,
})

// Safe hooks that don't violate rules of hooks
export function useSafeUiStore() {
  const [data, setData] = useState(defaultUiState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && storeModule) {
      // Subscribe to store changes
      const unsubscribe = storeModule.useAppStore.subscribe((state: any) => {
        setData(uiSelector(state))
      })
      
      // Set initial state
      setData(uiSelector(storeModule.useAppStore.getState()))
      setIsHydrated(true)
      
      return unsubscribe
    }
  }, [])

  return data
}

export function useSafeFiltersStore() {
  const [data, setData] = useState(defaultFiltersState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && storeModule) {
      const unsubscribe = storeModule.useAppStore.subscribe((state: any) => {
        setData(filtersSelector(state))
      })
      
      setData(filtersSelector(storeModule.useAppStore.getState()))
      setIsHydrated(true)
      
      return unsubscribe
    }
  }, [])

  return data
}

export function useSafePreferencesStore() {
  const [data, setData] = useState(defaultPreferencesState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && storeModule) {
      const unsubscribe = storeModule.useAppStore.subscribe((state: any) => {
        setData(preferencesSelector(state))
      })
      
      setData(preferencesSelector(storeModule.useAppStore.getState()))
      setIsHydrated(true)
      
      return unsubscribe
    }
  }, [])

  return data
}