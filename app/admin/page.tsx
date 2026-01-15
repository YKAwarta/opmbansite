import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { Award, LogOut, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use admin client to bypass RLS for database queries
  const adminClient = createAdminClient()

  // Check if user is admin
  const { data: member } = await adminClient
    .from('members')
    .select('role')
    .eq('id', user.id)
    .single()

  if (member?.role !== 'admin') redirect('/dashboard')

  // Get stats
  const { count: memberCount } = await adminClient
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: credentialCount } = await adminClient
    .from('credentials')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <ThemeToggle />
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{memberCount || 0}</p>
              <p className="text-gray-600">Active Members</p>
            </div>
            <Users className="w-8 h-8 text-[#093968]" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{credentialCount || 0}</p>
              <p className="text-gray-600">Credentials Issued</p>
            </div>
            <Award className="w-8 h-8 text-[#0abd62]" />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/invite">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center space-x-4">
              <UserPlus className="w-10 h-10 text-[#093968]" />
              <div>
                <h2 className="text-xl font-bold">Invite Members</h2>
                <p className="text-gray-600">Send invitations to new members</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/issue">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center space-x-4">
              <Award className="w-10 h-10 text-[#0abd62]" />
              <div>
                <h2 className="text-xl font-bold">Issue Credentials</h2>
                <p className="text-gray-600">Create badges, certificates, and cards</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}