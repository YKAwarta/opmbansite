import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getWelcomeEmail } from '@/lib/email/templates'
import { issueCredentialForMember } from '@/lib/credentials/service'

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
    // Step 1: Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, student_id, gender }
    })

    if (authError) throw authError

    // Step 2: Create member record
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

    // Step 3: Auto-issue credentials
    const currentYear = new Date().getFullYear()
    const credentialResults = {
      badge: null as any,
      certificate: null as any,
      membership_card: null as any,
      errors: [] as string[]
    }

    // Issue Badge
    try {
      console.log('Issuing badge for new member:', authData.user.id)
      const badgeResult = await issueCredentialForMember({
        memberId: authData.user.id,
        kind: 'badge',
        name: `Role Badge - ${currentYear}`
      })
      credentialResults.badge = badgeResult
      console.log('✅ Badge issued successfully')
    } catch (badgeError) {
      console.error('❌ Failed to issue badge:', badgeError)
      credentialResults.errors.push('badge')
    }

    // Issue Membership Certificate
    try {
      console.log('Issuing membership certificate for new member:', authData.user.id)
      const certResult = await issueCredentialForMember({
        memberId: authData.user.id,
        kind: 'certificate',
        name: `Membership Certificate - ${currentYear}`
      })
      credentialResults.certificate = certResult
      console.log('✅ Membership Certificate issued successfully')
    } catch (certError) {
      console.error('❌ Failed to issue certificate:', certError)
      credentialResults.errors.push('certificate')
    }

    // Issue Membership Card (with graceful handling for missing templates)
    try {
      console.log('Issuing membership card for new member:', authData.user.id)
      const cardResult = await issueCredentialForMember({
        memberId: authData.user.id,
        kind: 'membership_card',
        name: `Membership Card - ${currentYear}`
      })
      credentialResults.membership_card = cardResult
      console.log('✅ Membership Card issued successfully')
    } catch (cardError) {
      // Gracefully handle missing membership card templates
      console.warn('⚠️  Membership card template not found (expected if bucket is empty):', cardError)
      credentialResults.errors.push('membership_card')
    }

    // Step 4: Send welcome email
    if (process.env.RESEND_API_KEY) {
      const emailHtml = getWelcomeEmail({
        useEmbeddedLogo: false,
        fullName: full_name,
        email: email,
        password: password,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`
      })

      await resend.emails.send({
        from: 'The OPM&BAN Club <noreply@theopmbanclub.com>',
        to: email,
        subject: '🎉 Welcome to The OPM&BAN Club - Your Account is Ready!',
        html: emailHtml
      })
    }

    // Return success with credential issuance summary
    const successMessage = credentialResults.errors.length === 0
      ? 'Account created with all credentials issued successfully!'
      : `Account created! Credentials issued: ${['badge', 'certificate', 'membership_card'].filter(c => !credentialResults.errors.includes(c)).join(', ')}`

    return NextResponse.json({
      success: true,
      message: successMessage,
      credentials_issued: {
        badge: !!credentialResults.badge,
        certificate: !!credentialResults.certificate,
        membership_card: !!credentialResults.membership_card,
        failed: credentialResults.errors
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed'
    }, { status: 400 })
  }
}