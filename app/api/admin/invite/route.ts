import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

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
      await resend.emails.send({
        from: 'OPM/BAN Club <noreply@yourdomain.com>', // Update with your domain
        to: email,
        subject: 'Your OPM/BAN Club Account',
        html: `
          <h2>Welcome to OPM/BAN Club!</h2>
          <p>Dear ${full_name},</p>
          <p>Your account has been created. Here are your login credentials:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Website:</strong> ${process.env.NEXT_PUBLIC_APP_URL}/login</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login by going to your dashboard.</p>
          <p>Best regards,<br>OPM/BAN Club Team</p>
        `
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