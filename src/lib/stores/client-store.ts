import { useEffect, useState } from 'react'
import { useAppStore } from './app-store'
import type { CallSheetStatus } from '@prisma/client'

// Client-safe wrapper for Zustand stores to avoid hydration issues
export function useClientStore<T>(
  selector: (state: any) => T,
  defaultValue: T
): T {
  const [hydrated, setHydrated] = useState(false)
  const store = useAppStore(selector)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated ? store : defaultValue
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
  notifications: [],
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

// Create the selectors here to avoid importing from app-store
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

// Client-safe hooks
export const useClientUiStore = () => useClientStore(uiSelector, defaultUiState)
export const useClientFiltersStore = () => useClientStore(filtersSelector, defaultFiltersState)
export const useClientPreferencesStore = () => useClientStore(preferencesSelector, defaultPreferencesState)