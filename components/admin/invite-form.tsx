'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Copy, Loader2, RefreshCw } from 'lucide-react'
import { useState } from 'react'

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

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$'
    const array = new Uint32Array(12)
    crypto.getRandomValues(array)
    const password = Array.from(array, (num) => chars[num % chars.length]).join('') 
    setFormData({...formData, password})
  }

  const copyCredentials = () => {
    const text = `Email: ${formData.email}\nPassword: ${formData.password}`
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Credentials copied to clipboard',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.password) {
      toast({
        title: 'Error',
        description: 'Please generate or enter a password',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    const response = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      toast({
        title: 'Account Created!',
        description: `Login: ${formData.email} | Password: ${formData.password}`,
        duration: 10000
      })
      
      // Reset form but keep role
      setFormData({
        email: '',
        password: '',
        full_name: '',
        student_id: '',
        gender: '',
        role: formData.role,
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

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Create Member Account</CardTitle>
        <CardDescription>
          The member will receive their login credentials via email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@alfaisal.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password *</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  placeholder="Click generate"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={generatePassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                {formData.password && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={copyCredentials}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID *</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({...formData, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value, position: ''})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="officer">Officer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.role === 'officer' || formData.role === 'admin') && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="position">Position *</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => setFormData({...formData, position: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Financial Officer">Financial Officer</SelectItem>
                    <SelectItem value="Operations Officer">Operations Officer</SelectItem>
                    <SelectItem value="Media Officer">Media Officer</SelectItem>
                    <SelectItem value="Strategic Relations Officer">Strategic Relations Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading || !formData.gender}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account & Send Credentials'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}