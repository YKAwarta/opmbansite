'user client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {toast} from '@/hooks/use-toast'
import { set } from 'react-hook-form'

export function InviteForm(){
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })

        if(response.ok){
            toast({
                title: 'Success',
                description: 'Invitation sent successfully'
            })
            setFormData({
                email: '',
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
                description: error.error || 'Failed to send invitation',
                variant: 'destructive'
            })
        }

        setLoading(false)
    }

    return (
    <Card>
      <CardHeader>
        <CardTitle>Member Details</CardTitle>
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
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
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
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value})}
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
            {formData.role !== 'member' && (
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
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
                    <SelectItem value="Club Advisor">Club Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}