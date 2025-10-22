import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST() {
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

  // Create member using admin client
  const adminClient = createAdminClient()
  
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

    if (error) throw error

    return NextResponse.json({ success: true, member: data })
  } catch (error) {
    console.error('Error creating member:', error)
    // Return success anyway to not block login
    return NextResponse.json({ success: true, partial: true })
  }
}