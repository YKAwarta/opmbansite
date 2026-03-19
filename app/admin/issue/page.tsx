import { IssueCredentialForm } from '@/components/admin/issue-credential-form'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminIssuePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if user is admin
  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('id', user.id)
    .single()

  if (member?.role !== 'admin') redirect('/dashboard')

  // Get all members for the dropdown
  const { data: members } = await supabase
    .from('members')
    .select('id, full_name, student_id, gender, role, position')
    .eq('is_active', true)
    .order('full_name')

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Issue Credential</h1>
      </div>
      <IssueCredentialForm members={members || []} />
    </div>
  )
}