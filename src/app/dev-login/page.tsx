"use client"

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DevLoginPage() {
  const router = useRouter()

  const handleDevLogin = async () => {
    // For development, let's bypass the auth issue and go directly to dashboard
    router.push('/dashboard')
  }

  const handleNormalLogin = async () => {
    const result = await signIn('credentials', {
      email: 'demo@slate.com',
      password: 'password123',
      redirect: false
    })
    
    console.log('Direct signIn result:', result)
    
    if (result?.ok) {
      router.push('/dashboard')
    } else {
      console.error('Direct signIn failed:', result?.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Development Login</CardTitle>
          <CardDescription>
            Quick access for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleNormalLogin} className="w-full">
            Try Normal Login (demo@slate.com)
          </Button>
          <Button onClick={handleDevLogin} variant="outline" className="w-full">
            Bypass Auth (Dev Mode)
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            This page is for development only
          </p>
        </CardContent>
      </Card>
    </div>
  )
}