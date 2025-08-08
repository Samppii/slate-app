import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { CallSheetStatus } from '@prisma/client'

// UI State
interface UiState {
  // Navigation
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Modals and dialogs
  modals: {
    createCallSheet: boolean
    editCallSheet: boolean
    deleteCallSheet: boolean
    exportPdf: boolean
  }
  openModal: (modal: keyof UiState['modals']) => void
  closeModal: (modal: keyof UiState['modals']) => void
  closeAllModals: () => void
  
  // Loading states
  isLoading: {
    global: boolean
    callSheets: boolean
    crew: boolean
    export: boolean
  }
  setLoading: (key: keyof UiState['isLoading'], loading: boolean) => void
  
  // Notifications/toasts
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    timestamp: number
  }>
  addNotification: (notification: Omit<UiState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// Filters and Preferences
interface FiltersState {
  callSheets: {
    status?: CallSheetStatus
    projectType?: string
    search?: string
    sortBy: 'title' | 'shootDate' | 'createdAt' | 'status'
    sortOrder: 'asc' | 'desc'
    page: number
    limit: number
  }
  setCallSheetFilters: (filters: Partial<FiltersState['callSheets']>) => void
  resetCallSheetFilters: () => void
}

// User Preferences
interface PreferencesState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: PreferencesState['theme']) => void
  
  // Call sheet preferences
  defaultCallTime: string
  defaultDepartments: string[]
  setDefaultCallTime: (time: string) => void
  setDefaultDepartments: (departments: string[]) => void
  
  // View preferences
  dashboardView: 'grid' | 'list'
  setDashboardView: (view: PreferencesState['dashboardView']) => void
}

// Combined store type
type AppStore = UiState & FiltersState & PreferencesState

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        
        modals: {
          createCallSheet: false,
          editCallSheet: false,
          deleteCallSheet: false,
          exportPdf: false,
        },
        openModal: (modal) =>
          set((state) => ({
            modals: { ...state.modals, [modal]: true }
          })),
        closeModal: (modal) =>
          set((state) => ({
            modals: { ...state.modals, [modal]: false }
          })),
        closeAllModals: () =>
          set((state) => ({
            modals: Object.keys(state.modals).reduce(
              (acc, key) => ({ ...acc, [key]: false }),
              {} as UiState['modals']
            )
          })),
        
        isLoading: {
          global: false,
          callSheets: false,
          crew: false,
          export: false,
        },
        setLoading: (key, loading) =>
          set((state) => ({
            isLoading: { ...state.isLoading, [key]: loading }
          })),
        
        notifications: [],
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
              }
            ]
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          })),
        clearNotifications: () => set({ notifications: [] }),

        // Filters State
        callSheets: {
          sortBy: 'shootDate',
          sortOrder: 'desc',
          page: 1,
          limit: 12,
        },
        setCallSheetFilters: (filters) =>
          set((state) => ({
            callSheets: { ...state.callSheets, ...filters }
          })),
        resetCallSheetFilters: () =>
          set((state) => ({
            callSheets: {
              ...state.callSheets,
              status: undefined,
              projectType: undefined,
              search: undefined,
              page: 1,
            }
          })),

        // Preferences State
        theme: 'system',
        setTheme: (theme) => set({ theme }),
        
        defaultCallTime: '07:00',
        defaultDepartments: ['Camera', 'Sound', 'Art', 'Wardrobe', 'Grip', 'Electric'],
        setDefaultCallTime: (time) => set({ defaultCallTime: time }),
        setDefaultDepartments: (departments) => set({ defaultDepartments: departments }),
        
        dashboardView: 'grid',
        setDashboardView: (view) => set({ dashboardView: view }),
      }),
      {
        name: 'slate-app-store',
        storage: createJSONStorage(() => localStorage),
        // Only persist preferences and some UI state
        partialize: (state) => ({
          theme: state.theme,
          defaultCallTime: state.defaultCallTime,
          defaultDepartments: state.defaultDepartments,
          dashboardView: state.dashboardView,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
        // Skip hydration on SSR
        skipHydration: true,
      }
    ),
    {
      name: 'slate-app-store',
    }
  )
)

// Create cached selectors to avoid infinite loops
const uiSelector = (state: AppStore) => ({
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

const filtersSelector = (state: AppStore) => ({
  callSheets: state.callSheets,
  setCallSheetFilters: state.setCallSheetFilters,
  resetCallSheetFilters: state.resetCallSheetFilters,
})

const preferencesSelector = (state: AppStore) => ({
  theme: state.theme,
  setTheme: state.setTheme,
  defaultCallTime: state.defaultCallTime,
  defaultDepartments: state.defaultDepartments,
  setDefaultCallTime: state.setDefaultCallTime,
  setDefaultDepartments: state.setDefaultDepartments,
  dashboardView: state.dashboardView,
  setDashboardView: state.setDashboardView,
})

// Selectors for common use cases
export const useUiStore = () => useAppStore(uiSelector)
export const useFiltersStore = () => useAppStore(filtersSelector)
export const usePreferencesStore = () => useAppStore(preferencesSelector)