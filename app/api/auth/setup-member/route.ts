import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  // Use server client only for authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use admin client for all database operations to bypass RLS
  // This is necessary because RLS policies may not have proper auth context
  // in server-side API routes during the login flow
  const adminClient = createAdminClient()

  // Check if member already exists using admin client
  const { data: existingMember } = await adminClient
    .from('members')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existingMember) {
    return NextResponse.json({ exists: true, member: existingMember })
  }

  // Create new member
  try {
    const { data, error } = await adminClient
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
    return NextResponse.json({ success: false, error: 'Failed to create member', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}