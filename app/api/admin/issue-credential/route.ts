import { createClient } from '@/lib/supabase/server'
import { issueCredentialForMember } from '@/lib/credentials/service'
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
    const body = await request.json()
    
    const result = await issueCredentialForMember({
      memberId: body.memberId,
      kind: body.kind,
      name: body.name,
      expiryDate: body.expiryDate
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