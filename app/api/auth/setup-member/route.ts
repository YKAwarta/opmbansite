import { rateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Rate limit: 10 calls per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!rateLimit(`setup-member:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Use server client only for authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if member already exists
  const { data: existingMember } = await supabase
    .from('members')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existingMember) {
    return NextResponse.json({ exists: true, member: existingMember })
  }

  // Only allow Alfaisal University emails to self-register a new member record.
  // Existing members (already found above) are not affected by this check.
  const email = user.email ?? ''
  if (!email.endsWith('@alfaisal.edu') && !email.endsWith('.alfaisal.edu')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Create new member
  try {
    const { data, error } = await supabase
      .from('members')
      .insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
        student_id: user.user_metadata?.student_id || `TEMP_${user.id.slice(0, 8)}`,
        gender: user.user_metadata?.gender || 'male',
        role: 'member',
        position: null,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      // Handle race condition where member was created between check and insert
      if (error.code === '23505') {
        return NextResponse.json({ exists: true, message: 'Member already exists' })
      }
      throw error
    }

    return NextResponse.json({ success: true, member: data })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json({ success: false, error: 'Failed to create member' }, { status: 500 })
  }
}