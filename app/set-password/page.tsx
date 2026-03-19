'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setDone(true)
    // Give the user a moment to read the success message, then go to dashboard
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#093968] via-[#093968]/80 to-[#0abd62]/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-[#0abd62]" />
            <p className="text-lg font-semibold">Password set successfully!</p>
            <p className="text-muted-foreground text-sm">Redirecting you to your dashboard…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#093968] via-[#093968]/80 to-[#0abd62]/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Set Your Password</CardTitle>
          <CardDescription>
            Choose a password to secure your account. You only need to do this once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Set Password & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
