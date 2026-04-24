import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { deleteStorageObjectSchema } from '@/lib/validations/admin'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('id', user.id)
    .single()

  if (member?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const validation = deleteStorageObjectSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({
      error: 'Validation failed',
      details: validation.error.flatten().fieldErrors
    }, { status: 400 })
  }

  const { bucket, path } = validation.data

  try {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Storage delete error:', error)
      return NextResponse.json({ error: 'Failed to delete object' }, { status: 500 })
    }

    // .remove() returns the list of objects it actually removed.
    // An empty array means the object did not exist.
    const deleted = Array.isArray(data) && data.length > 0

    return NextResponse.json({
      success: true,
      deleted,
      bucket,
      path
    })
  } catch (error) {
    console.error('Unexpected error deleting storage object:', error)
    return NextResponse.json({ error: 'Failed to delete object' }, { status: 500 })
  }
}
