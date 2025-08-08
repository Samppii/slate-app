"use client"

import { useEffect } from 'react'
import { useAppStore } from '@/lib/stores/app-store'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually hydrate the store after client-side render
    useAppStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}