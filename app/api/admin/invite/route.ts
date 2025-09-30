import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 400 })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: isAdmin, error: adminErr } = await supabase.rpc('is_admin')
  if (adminErr) return NextResponse.json({ error: adminErr.message }, { status: 400 })
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const list: Array<string | { email: string; full_name?: string; student_id?: string; gender?: 'male'|'female' }> =
    Array.isArray(body?.emails) ? body.emails : [body?.emails]

  const admin = createAdminClient()
  const results: Array<{ email: string; success: boolean; error?: string }> = []

  for (const item of list) {
    const email = (typeof item === 'string' ? item : item?.email)?.trim().toLowerCase()
    if (!email) {
      results.push({ email: '', success: false, error: 'missing email' })
      continue
    }

    const { data: allow, error: allowErr } = await admin
      .from('approved_emails')
      .select('full_name, student_id, gender')
      .eq('email', email)
      .single()

    if (allowErr || !allow) {
      results.push({ email, success: false, error: 'email not on allowlist' })
      continue
    }

    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: allow.full_name ?? null,
        student_id: allow.student_id ?? null,
        gender: allow.gender ?? null,
      },
    })

    results.push({ email, success: !inviteErr, error: inviteErr?.message })
  }

  return NextResponse.json({ results })
}
