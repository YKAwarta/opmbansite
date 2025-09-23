import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await (await supabase).auth.getUser()
  if (!user){
    redirect('/login')
  }
  
  const { data: member } = await (await supabase).from('members').select('*').eq('id', user.id).single()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {member?.full_name}</h1>
      {/* We'll add credentials display here next */}
    </div>
  )
}