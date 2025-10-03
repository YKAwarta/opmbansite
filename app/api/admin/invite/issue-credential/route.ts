export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { issueCredentialForMember } from '@/lib/credentials/service'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 400 })
  if (!user)   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: isAdmin, error: adminErr } = await supabase.rpc('is_admin')
  if (adminErr) return NextResponse.json({ error: adminErr.message }, { status: 400 })
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const memberId = String(body?.memberId ?? '')
  const kind = String(body?.kind ?? '')
  const name = String(body?.name ?? '')

  if (!memberId || !name || !['certificate','membership_card','badge'].includes(kind)) {
    return NextResponse.json({ error: 'memberId, name, and kind are required' }, { status: 400 })
  }

  try {
    const created = await issueCredentialForMember({
      memberId,
      kind: kind as any,
      name,
      expiryISO: body?.expiryISO ?? null,
    })
    return NextResponse.json({ success: true, credential: created })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Issue failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
