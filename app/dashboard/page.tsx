import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PasswordChangeForm } from '@/components/account/password-change-form'
import Link from 'next/link'
import { ExternalLink, LogOut, Download } from 'lucide-react'

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {member.full_name}</h1>
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </form>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
              <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
            </div>
            {member.position && (
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{member.position}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date(member.join_date).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Credentials</CardTitle>
            <CardDescription>
              Your digital badges, certificates, and membership cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {credentials && credentials.length > 0 ? (
              <div className="grid gap-4">
                {credentials.map((cred) => (
                  <Card key={cred.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {cred.image_url && (
                        <div className="md:w-48 h-32 md:h-auto bg-gray-100">
                          <img 
                            src={cred.image_url} 
                            alt={cred.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{cred.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {cred.type.replace('_', ' ')}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {cred.verification_code}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          Issued: {new Date(cred.issued_date).toLocaleDateString()}
                        </p>
                        
                        <div className="flex gap-2">
                          <Link 
                            href={`/verify/${cred.verification_code}`}
                            target="_blank"
                          >
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          </Link>
                          <Link 
                            href={cred.image_url}
                            target="_blank"
                            download
                          >
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </Link>
                        </div>
                        
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                          <p className="text-muted-foreground">Verification URL:</p>
                          <p className="font-mono break-all">
                            {baseUrl}/verify/{cred.verification_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No credentials issued yet. Contact your club administrator.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Form - ADD THIS SECTION */}
      <div className="mt-6">
        <PasswordChangeForm />
      </div>

      {/* Admin Link */}
      {member.role === 'admin' && (
        <div className="mt-6">
          <Link href="/admin">
            <Button className="bg-[#093968] hover:bg-[#093968]/90">
              Go to Admin Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}