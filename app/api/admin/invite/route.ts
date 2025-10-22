import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { email, full_name, student_id, gender, role, position, password } = body

  const adminClient = createAdminClient()

  try {
    // Create auth user with password
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password, // Admin sets initial password
      email_confirm: true,
      user_metadata: {
        full_name,
        student_id,
        gender
      }
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
        position: position || null,
        gender,
        is_active: true
      })

    if (memberError) {
      // Rollback: delete auth user if member creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      throw memberError
    }

    return NextResponse.json({ 
      success: true, 
      message: `Account created for ${email} with password: ${password}` 
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create account' 
    }, { status: 400 })
  }
}