"use client"

import { useSafeUiStore, useSafePreferencesStore } from '@/lib/stores/safe-store'
import { useCallSheets } from '@/lib/hooks/use-call-sheets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function StateDemoComponent() {
  const { 
    addNotification, 
    modals, 
    openModal, 
    closeModal,
    isLoading,
    setLoading
  } = useSafeUiStore()
  
  const { 
    theme, 
    setTheme, 
    dashboardView, 
    setDashboardView,
    defaultCallTime,
    setDefaultCallTime
  } = useSafePreferencesStore()

  const { data: callSheetsData, isLoading: callSheetsLoading, error } = useCallSheets({
    page: 1,
    limit: 3
  })

  const handleTestNotification = () => {
    addNotification({
      type: 'success',
      title: 'State Management Test',
      message: 'Zustand store is working correctly!',
    })
  }

  const handleTestLoading = () => {
    setLoading('global', true)
    setTimeout(() => {
      setLoading('global', false)
      addNotification({
        type: 'info',
        title: 'Loading Complete',
        message: 'Global loading state updated successfully.',
      })
    }, 2000)
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>State Management Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Notification Tests */}
          <div className="space-y-2">
            <h3 className="font-semibold">Notification System</h3>
            <div className="flex gap-2">
              <Button onClick={handleTestNotification} variant="outline">
                Test Success Notification
              </Button>
              <Button onClick={() => addNotification({
                type: 'error',
                title: 'Test Error',
                message: 'This is an error notification test.'
              })} variant="destructive">
                Test Error
              </Button>
              <Button onClick={() => addNotification({
                type: 'warning',
                title: 'Test Warning',
                message: 'This is a warning notification test.'
              })} variant="outline">
                Test Warning
              </Button>
            </div>
          </div>

          {/* Modal Tests */}
          <div className="space-y-2">
            <h3 className="font-semibold">Modal Management</h3>
            <div className="flex gap-2">
              <Button onClick={() => openModal('createCallSheet')} variant="outline">
                Open Create Modal
              </Button>
              {modals.createCallSheet && (
                <Badge variant="default">Create Modal: Open</Badge>
              )}
              <Button onClick={() => closeModal('createCallSheet')} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>

          {/* Loading State Tests */}
          <div className="space-y-2">
            <h3 className="font-semibold">Loading States</h3>
            <div className="flex gap-2 items-center">
              <Button onClick={handleTestLoading} disabled={isLoading.global}>
                {isLoading.global ? 'Loading...' : 'Test Global Loading'}
              </Button>
              {isLoading.global && (
                <Badge variant="secondary">Loading Active</Badge>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <h3 className="font-semibold">User Preferences</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Theme:</span>
              <Badge variant="outline">{theme}</Badge>
              <Button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                variant="outline" 
                size="sm"
              >
                Toggle
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">View:</span>
              <Badge variant="outline">{dashboardView}</Badge>
              <Button 
                onClick={() => setDashboardView(dashboardView === 'grid' ? 'list' : 'grid')} 
                variant="outline" 
                size="sm"
              >
                Switch
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Default Call Time:</span>
              <Badge variant="outline">{defaultCallTime}</Badge>
              <Button 
                onClick={() => setDefaultCallTime(defaultCallTime === '07:00' ? '06:00' : '07:00')} 
                variant="outline" 
                size="sm"
              >
                Change
              </Button>
            </div>
          </div>

          {/* React Query Integration */}
          <div className="space-y-2">
            <h3 className="font-semibold">React Query Integration</h3>
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                <span className="text-sm">Call Sheets Loading:</span>
                <Badge variant={callSheetsLoading ? "secondary" : "outline"}>
                  {callSheetsLoading ? 'Loading' : 'Loaded'}
                </Badge>
              </div>
              {error && (
                <div className="flex gap-2 items-center">
                  <span className="text-sm">Error:</span>
                  <Badge variant="destructive">{error.message}</Badge>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <span className="text-sm">Call Sheets Count:</span>
                <Badge variant="outline">
                  {callSheetsData?.callSheets?.length || 0}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}