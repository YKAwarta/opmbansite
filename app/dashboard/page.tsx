import { PasswordChangeForm } from '@/components/account/password-change-form'
import { CredentialCard } from '@/components/dashboard/credential-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import { CreditCard, GraduationCap, LogOut } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theopmbanclub.com'
  
  // Separate credentials by type
  const badges = credentials?.filter(c => c.type === 'badge') || []
  const membershipCards = credentials?.filter(c => c.type === 'membership_card') || []
  const certificates = credentials?.filter(c => c.type === 'certificate') || []

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {member.full_name}!</h1>
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

        {/* Credentials with Tabs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Credentials</CardTitle>
            <CardDescription>
              Your digital badges, certificates, and membership cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="essentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="essentials">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Essentials
                </TabsTrigger>
                <TabsTrigger value="certificates">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Certificates ({certificates.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="essentials" className="space-y-4">
                {/* Badge */}
                {badges.map((badge) => (
                  <CredentialCard key={badge.id} credential={badge} baseUrl={baseUrl} />
                ))}
                
                {/* Membership Card */}
                {membershipCards.map((card) => (
                  <CredentialCard key={card.id} credential={card} baseUrl={baseUrl} />
                ))}
                
                {badges.length === 0 && membershipCards.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No badge or membership card issued yet.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="certificates" className="space-y-4">
                {certificates.map((cert) => (
                  <CredentialCard key={cert.id} credential={cert} baseUrl={baseUrl} />
                ))}
                
                {certificates.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No certificates earned yet.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <PasswordChangeForm />
      </div>

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