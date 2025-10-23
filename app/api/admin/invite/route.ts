import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify admin
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
      user_metadata: {
        full_name,
        student_id,
        gender
      }
    })

    if (authError) throw authError

    // Step 2: Create member record (CRITICAL)
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
      // ROLLBACK: Delete auth user if member creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      throw memberError
    }

    // Step 3: Send email with credentials
    // For now, we'll return the credentials for manual sending
    // In production, integrate with an email service

    return NextResponse.json({ 
      success: true,
      message: 'Account created successfully',
      credentials: {
        email,
        password,
        instruction: 'User can change password in their dashboard after login'
      }
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create account' 
    }, { status: 400 })
  }
}