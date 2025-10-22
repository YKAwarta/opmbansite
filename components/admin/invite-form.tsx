'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export function InviteForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    student_id: '',
    gender: '',
    role: 'member',
    position: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      const data = await response.json()
      toast({
        title: 'Success',
        description: `Account created. Email: ${formData.email}, Password: ${formData.password}`,
      })
      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        student_id: '',
        gender: '',
        role: 'member',
        position: ''
      })
    } else {
      const error = await response.json()
      toast({
        title: 'Error',
        description: error.error || 'Failed to create account',
        variant: 'destructive'
      })
    }
    
    setLoading(false)
  }

  // Generate random password
  const generatePassword = () => {
    const password = `Pass${Math.random().toString(36).slice(-8)}!`
    setFormData({...formData, password})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Member Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <Button type="button" variant="outline" onClick={generatePassword}>
                  Generate
                </Button>
              </div>
            </div>
            {/* Rest of the form fields... */}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}