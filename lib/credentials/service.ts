import { createAdminClient } from '@/lib/supabase/admin'
import { generateCredential } from './generator'

export async function issueCredentialForMember(params: {
  memberId: string
  kind: 'badge' | 'certificate' | 'membership_card'
  name: string
  expiryDate?: string
}) {
  const adminClient = createAdminClient()
  
  console.log('Issuing credential:', params)
  
  // Get member data
  const { data: member, error: memberError } = await adminClient
    .from('members')
    .select('*')
    .eq('id', params.memberId)
    .single()

  if (memberError || !member) {
    console.error('Member lookup failed:', memberError)
    throw new Error('Member not found')
  }

  console.log('Member found:', member.full_name, member.position, member.gender)

  let imageUrl: string

  // Badges - use static files
 // Badges - use static files
if (params.kind === 'badge') {
  let badgeFile: string
  
  if (member.position) {
    // Officer badges
    const position = member.position.toLowerCase().replace(/ /g, '-')
    if (position === 'president') {
      badgeFile = `president-${member.gender}.png`
    } else {
      // Map position names to file names
      const positionMap: Record<string, string> = {
        'financial-officer': 'financial.png',
        'operations-officer': 'operations.png',
        'media-officer': 'media.png',
        'strategic-relations-officer': 'relations.png'
      }
      badgeFile = positionMap[position] || 'member.png'
    }
  } else {
    // Regular member badge
    badgeFile = `member.png`
  }
  
  imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/generated-credentials/badges/${badgeFile}`
  console.log('Badge URL:', imageUrl)
}
  // Certificates and Cards - generate with text
  else {
    try {
      // Determine template path
      const position = member.position?.toLowerCase().replace(/ /g, '-') || 'member'
      const needsGender = position === 'member' || position === 'president'
      const genderSuffix = needsGender ? `-${member.gender}` : ''
      
      // Fix: Use singular form for folder name
      const folderName = params.kind === 'membership_card' ? 'cards' : 'certificates'
      const templateFileName = params.kind === 'membership_card' ? 
        `card-${position}${genderSuffix}.png` : 
        `certificate-${position}${genderSuffix}.png`
      
      const templateUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/credential-templates/${folderName}/${templateFileName}`
      console.log('Template URL:', templateUrl)
      
      // Test if template exists
      const testFetch = await fetch(templateUrl)
      if (!testFetch.ok) {
        throw new Error(`Template not found at: ${templateUrl}`)
      }
      
      // Generate credential with text overlay
      const imageBuffer = await generateCredential(
        templateUrl,
        params.kind as 'certificate' | 'membership_card',
        {
          name: member.full_name,
          studentId: member.student_id,
          issueDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }
      )
      
      // Upload to Supabase
      const uploadFileName = `${params.memberId}/${params.kind}_${Date.now()}.png`
      const { error: uploadError } = await adminClient.storage
      .from('generated-credentials')
      .upload(uploadFileName, imageBuffer, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/generated-credentials/${uploadFileName}`
  } 
    catch (err) {
      console.error('Generation error:', err)
      throw err
    }
  }

  // Create database record
  const { data, error } = await adminClient.rpc('admin_issue_credential', {
    p_member_id: params.memberId,
    p_type: params.kind,
    p_name: params.name,
    p_image_url: imageUrl,
    p_expiry_date: params.expiryDate || null,
    p_issued_date: new Date().toISOString(),
    p_credential_data: {}
  })

  if (error) {
    console.error('RPC error:', error)
    throw error
  }
  
  return data
}