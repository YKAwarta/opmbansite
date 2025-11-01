import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PasswordChangeForm } from '@/components/account/password-change-form'
import Link from 'next/link'
import { ExternalLink, LogOut, Download, CreditCard, GraduationCap } from 'lucide-react'

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

interface CredentialType {
  id: string
  name: string
  type: string
  image_url: string
  verification_code: string
  issued_date: string
}

// Credential Card Component
function CredentialCard({ credential, baseUrl }: { credential: CredentialType, baseUrl: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {credential.image_url && (
          <div className="md:w-48 h-32 md:h-auto bg-gray-100">
            <img 
              src={credential.image_url} 
              alt={credential.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold">{credential.name}</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {credential.type.replace('_', ' ')}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {credential.verification_code}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Issued: {new Date(credential.issued_date).toLocaleDateString()}
          </p>
          
          <div className="flex gap-2">
            <Link href={`/verify/${credential.verification_code}`} target="_blank">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-3 h-3 mr-1" />
                Verify
              </Button>
            </Link>
            <Link href={credential.image_url} target="_blank" download>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </Link>
          </div>
          
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <p className="text-muted-foreground">Verification URL:</p>
            <p className="font-mono break-all">
              {baseUrl}/verify/{credential.verification_code}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}