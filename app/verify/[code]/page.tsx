import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle, XCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ code: string }>  // Make params a Promise
}

export default async function VerifyPage({ params }: PageProps) {
  const { code } = await params  // Await the params
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('verify_credential', { code })

  if (error || !data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <CardTitle>Verification Failed</CardTitle>
            </div>
            <CardDescription>
              This credential could not be verified. It may be invalid or has been revoked.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const credential = data[0]
  const isExpired = credential.expiry_date && new Date(credential.expiry_date) < new Date()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <CardTitle>Verified Credential</CardTitle>
          </div>
          <CardDescription>
            This credential has been verified by The OPM & BAN Club
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="secondary" className="mt-1">
                {credential.credential_type}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={isExpired ? "destructive" : "default"} className="mt-1">
                {isExpired ? 'Expired' : 'Active'}
              </Badge>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Credential Name</p>
            <p className="font-medium">{credential.credential_name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Issued To</p>
            <p className="font-medium">{credential.member_name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Student ID</p>
            <p className="font-medium">{credential.member_student_id}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Issued Date</p>
              <p className="font-medium">
                {new Date(credential.issued_date).toLocaleDateString()}
              </p>
            </div>
            {credential.expiry_date && (
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-medium">
                  {new Date(credential.expiry_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {credential.image_url && (
            <div className="mt-4">
              <img 
                src={credential.image_url} 
                alt="Credential"
                className="w-full rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}