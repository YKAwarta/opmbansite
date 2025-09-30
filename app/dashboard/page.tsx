import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!member) redirect('/login')

  const { data: credentials } = await supabase
    .from('credentials')
    .select('*')
    .eq('member_id', user.id)
    .eq('is_active', true)
    .order('issued_date', { ascending: false })

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Welcome, {member.full_name}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="font-medium">{member.student_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>{member.role}</Badge>
            </div>
            {member.position && (
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{member.position}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Credentials</CardTitle>
            <CardDescription>Your badges, certificates, and membership card</CardDescription>
          </CardHeader>
          <CardContent>
            {credentials && credentials.length > 0 ? (
              <div className="space-y-3">
                {credentials.map((cred: any) => (
                  <div key={cred.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{cred.name}</p>
                        <p className="text-sm text-muted-foreground">{cred.type}</p>
                      </div>
                      <Badge variant="outline">{cred.verification_code}</Badge>
                    </div>
                    <div className="mt-2">
                      <Link href={`/verify/${cred.verification_code}`} target="_blank">
                        <Button size="sm" variant="outline">View Verification</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No credentials issued yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
