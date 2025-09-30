import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  const supabase = await createClient()

  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 400 })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing, error: existErr } = await supabase
    .from('members')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existErr) return NextResponse.json({ error: existErr.message }, { status: 400 })
  if (existing) return NextResponse.json({ exists: true, member: existing })

  const admin = createAdminClient()
  const email = (user.email ?? '').toLowerCase()

  const { data: allow, error: allowErr } = await admin
    .from('approved_emails')
    .select('full_name, student_id, gender')
    .eq('email', email)
    .single()

  if (allowErr || !allow) {
    return NextResponse.json({ error: 'Not approved for membership' }, { status: 403 })
  }

  const { data, error } = await admin.rpc('admin_upsert_member', {
    p_id: user.id,
    p_email: email,
    p_full_name: allow.full_name,
    p_student_id: allow.student_id,
    p_gender: allow.gender,
    p_role: 'member',
    p_position: null,
    p_is_active: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true, member: data })
}
