'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

interface Member {
  id: string
  full_name: string
  student_id: string
  gender: string
  role: string
  position: string | null
}

export function IssueCredentialForm({ members }: { members: Member[] }) {
  const [loading, setLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [credentialType, setCredentialType] = useState<string>('')
  const [credentialName, setCredentialName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMember || !credentialType) return

    setLoading(true)

    const member = members.find(m => m.id === selectedMember)
    if (!member) return

    // Auto-generate credential name if not provided
    const name = credentialName || `${credentialType.charAt(0).toUpperCase() + credentialType.slice(1)} - ${new Date().getFullYear()}`

    const response = await fetch('/api/admin/issue-credential', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: selectedMember,
        kind: credentialType,
        name: name
      })
    })

    if (response.ok) {
      const data = await response.json()
      toast({
        title: 'Success',
        description: `Credential issued with verification code: ${data.verification_code}`,
      })
      // Reset form
      setSelectedMember('')
      setCredentialType('')
      setCredentialName('')
    } else {
      toast({
        title: 'Error',
        description: 'Failed to issue credential',
        variant: 'destructive'
      })
    }
    
    setLoading(false)
  }

  const selectedMemberData = members.find(m => m.id === selectedMember)

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="member">Select Member</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.full_name} - {member.student_id} ({member.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMemberData && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm"><strong>Name:</strong> {selectedMemberData.full_name}</p>
            <p className="text-sm"><strong>Role:</strong> {selectedMemberData.role}</p>
            {selectedMemberData.position && (
              <p className="text-sm"><strong>Position:</strong> {selectedMemberData.position}</p>
            )}
            <p className="text-sm"><strong>Gender:</strong> {selectedMemberData.gender}</p>
          </div>
        )}

        <div>
          <Label htmlFor="type">Credential Type</Label>
          <Select value={credentialType} onValueChange={setCredentialType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose credential type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="badge">Badge</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="membership_card">Membership Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className ="space-y-2">
          <Label htmlFor="name">Credential Name (Optional)</Label>
          <Input
            id="name"
            value={credentialName}
            onChange={(e) => setCredentialName(e.target.value)}
            placeholder="e.g., '2025 Membership Certificate'"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading || !selectedMember || !credentialType}
          className="w-full"
        >
          {loading ? 'Issuing...' : 'Issue Credential'}
        </Button>
      </form>
    </Card>
  )
}