import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getWelcomeEmail } from '@/lib/email/templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminCheck } = await supabase
    .from('members')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminCheck?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { email, password, full_name, student_id, gender, role, position } = body

  const adminClient = createAdminClient()

  try {
    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, student_id, gender }
    })

    if (authError) throw authError

    // Create member record
    const { error: memberError } = await adminClient
      .from('members')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        student_id,
        role: role || 'member',
        position: (role === 'officer' || role === 'admin') ? position : null,
        gender,
        is_active: true
      })

    if (memberError) {
      await adminClient.auth.admin.deleteUser(authData.user.id)
      throw memberError
    }

    // Send email with credentials
    if (process.env.RESEND_API_KEY) {
      const fs = await import('fs/promises')
const path = await import('path')
const logoPath = path.join(process.cwd(), 'public', 'club_logo_32.png')
const logoBuffer = await fs.readFile(logoPath)

      const emailHtml = getWelcomeEmail({
        useEmbeddedLogo: true,
        fullName: full_name,
        email: email,
        password: password,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`
      })

      await resend.emails.send({
        from: 'The OPM&BAN Club <noreply@theopmbanclub.com>',
        to: email,
        subject: '🎉 Welcome to The OPM&BAN Club - Your Account is Ready!',
        html: emailHtml,
        attachments: [
          {
            filename: 'club_logo_32.png',
            content: logoBuffer,
            contentId: 'logo'
          }
        ]
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Account created and email sent'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed' 
    }, { status: 400 })
  }
}