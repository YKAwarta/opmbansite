import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IssueCredentialForm } from '@/components/admin/issue-credential-form'

export default async function AdminIssuePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) redirect('/dashboard')

  // Get all members for the dropdown
  const { data: members } = await supabase
    .from('members')
    .select('id, full_name, student_id, gender, role, position')
    .eq('is_active', true)
    .order('full_name')

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Issue Credential</h1>
      <IssueCredentialForm members={members || []} />
    </div>
  )
}