import { issueCredentialForMember } from '@/lib/credentials/service'
import { createClient } from '@/lib/supabase/server'
import { issueCredentialSchema } from '@/lib/validations/admin'
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
  
  try {
    let body
    try{
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const validation = issueCredentialSchema.safeParse(body)
    if (!validation.success){
      return NextResponse.json({error: 'Validation failed', details: validation.error.flatten().fieldErrors }, { status: 400 })
    }

    const allowedKinds = new Set(['badge', 'certificate', 'membership_card'] as const)
    if (!allowedKinds.has(body.kind)) {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })
    }

    if (typeof body.memberId !== 'string' || body.memberId.length < 10) {
      return NextResponse.json({ error: 'Invalid memberId' }, { status: 400 })
    }

    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    
    const result = await issueCredentialForMember({
      memberId: validation.data.memberId,
      kind: validation.data.kind,
      name: validation.data.name,
      expiryDate: validation.data.expiryDate ?? undefined
    })
    
    // Result is an array from RPC, get first item
    const credential = Array.isArray(result) ? result[0] : result
    
    return NextResponse.json({ 
      success: true, 
      credential,
      verification_code: credential?.verification_code || 'Check dashboard'
    })
  } catch (error) {
    console.error('Error issuing credential:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to issue credential' 
    }, { status: 500 })
  }
}