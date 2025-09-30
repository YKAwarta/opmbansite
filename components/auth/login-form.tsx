'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        toast({
          title: 'Login failed',
          description: signInError.message,
          variant: 'destructive',
        })
        return
      }

      const setupResponse = await fetch('/api/auth/setup-member', {
        method: 'POST',
      })

      if (!setupResponse.ok) {
        const errorData = await setupResponse.json()
        console.error('Member setup failed:', errorData)
        toast({
          title: 'Setup Error',
          description: 'Failed to complete account setup. Please contact an administrator.',
          variant: 'destructive',
        })
        await supabase.auth.signOut()
        return
      }

      toast({
        title: 'Welcome!',
        description: 'Login successful',
      })

      router.refresh()
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Member Login</CardTitle>
        <CardDescription>
          Enter your Alfaisal university email and your password to access your e-wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Alfaisal Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="...@alfaisal.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}