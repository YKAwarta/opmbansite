import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InviteForm } from '@/components/admin/invite-form'

export default async function AdminInvitePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('id', user.id)
    .single()

  if (member?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Invite New Member</h1>
      <InviteForm />
    </div>
  )
}