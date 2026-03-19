import { issueCredentialForMember } from '@/lib/credentials/service'
import { getWelcomeEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { inviteMemberSchema } from '@/lib/validations/admin'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  // Rate limit: 20 invites per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!rateLimit(`invite:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()

  // Use adminClient to bypass RLS for role check (consistent with admin page)
  const { data: adminCheck } = await adminClient
    .from('members')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminCheck?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body
  try{
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const validation = inviteMemberSchema.safeParse(body)
  if (!validation.success){
    return NextResponse.json({
      error: 'Validation failed',
      details: validation.error.flatten().fieldErrors
    }, { status: 400 })
  }

  const { email, full_name, student_id, phone_number, gender, role, position } = validation.data

  try {
    // Step 1: Generate invite link (creates auth user with no password)
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        data: { full_name, student_id, gender },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    })

    if (linkError) throw linkError

    const inviteLink = linkData.properties?.action_link
    const userId = linkData.user?.id

    if (!inviteLink || !userId) {
      throw new Error('Failed to generate invite link: missing action_link or user id')
    }

    // Step 2: Create member record
    const { error: memberError } = await adminClient
      .from('members')
      .insert({
        id: userId,
        email,
        full_name,
        student_id,
        phone_number,
        role: role || 'member',
        position: (role === 'officer' || role === 'admin') ? position : null,
        gender,
        is_active: true
      })

    if (memberError) {
      await adminClient.auth.admin.deleteUser(userId)
      throw memberError
    }

    // Step 3: Auto-issue credentials
    const currentYear = new Date().getFullYear()
    const credentialResults: {
      badge: unknown
      certificate: unknown
      membership_card: unknown
      errors: string[]
    } = {
      badge: null,
      certificate: null,
      membership_card: null,
      errors: []
    }

    // Issue Badge
    try {
      const badgeResult = await issueCredentialForMember({
        memberId: userId,
        kind: 'badge',
        name: `Badge (${full_name}) - ${currentYear}`
      })
      credentialResults.badge = badgeResult
    } catch (badgeError) {
      credentialResults.errors.push('badge')
    }

    // Issue Membership Certificate
    try {
      const certResult = await issueCredentialForMember({
        memberId: userId,
        kind: 'certificate',
        name: `Membership Certificate (${full_name}) - ${currentYear}`
      })
      credentialResults.certificate = certResult
    } catch (certError) {
      credentialResults.errors.push('certificate')
    }

    // Issue Membership Card (with graceful handling for missing templates)
    try {
      const cardResult = await issueCredentialForMember({
        memberId: userId,
        kind: 'membership_card',
        name: `Membership Card (${full_name}) - ${currentYear}`
      })
      credentialResults.membership_card = cardResult
    } catch (cardError) {
      // Gracefully handle missing membership card templates
      credentialResults.errors.push('membership_card')
    }

    // Step 4: Send welcome email with invite link
    if (process.env.RESEND_API_KEY) {
      const emailHtml = getWelcomeEmail({
        useEmbeddedLogo: false,
        fullName: full_name,
        email: email,
        inviteLink
      })

      await resend.emails.send({
        from: 'The OPM&BAN Club <noreply@theopmbanclub.com>',
        to: email,
        subject: '🎉 Welcome to The OPM&BAN Club - Set Up Your Account!',
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
    console.error('Error creating member:', error)
    return NextResponse.json({
      error: 'Failed to create member account'
    }, { status: 400 })
  }
}
