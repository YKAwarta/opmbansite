'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { templateKeyForTemplate, badgeKey, type CredentialKind, type Gender, type Role } from './templates'
import { renderOnTemplate } from './generator'

const TEMPLATES_BUCKET = 'credential-templates'
const OUTPUT_BUCKET    = 'generated-credentials'

function needsCanvas(kind: CredentialKind) {
  return kind === 'certificate' || kind === 'membership_card'
}

/**
 * Issues a credential for a member:
 * - For certificate/card: renders onto template, uploads PNG under <uuid>/<type>_<ts>.png.
 * - For badge: uses static badge under generated-credentials/badges/*.png.
 * Persists via admin RPC `admin_issue_credential` and returns { id, verification_code }.
 */
export async function issueCredentialForMember(params: {
  memberId: string
  kind: CredentialKind
  name: string                 // credential display name (e.g., "2025 Membership Card")
  expiryISO?: string | null
}) {
  const admin = createAdminClient()

  // Canonical member data
  const { data: m, error: mErr } = await admin
    .from('members')
    .select('full_name, student_id, gender, role, position')
    .eq('id', params.memberId)
    .single()
  if (mErr || !m) throw new Error('Member not found')

  const gender = m.gender as Gender
  const role: Role = (m.role === 'officer' || m.role === 'admin') ? 'officer' : 'member'

  let imageUrl: string | null = null

  if (needsCanvas(params.kind)) {
    // Resolve template public URL
    const key = templateKeyForTemplate(params.kind as Exclude<CredentialKind,'badge'>, gender, role, m.position)
    const { data: pubTpl } = admin.storage.from(TEMPLATES_BUCKET).getPublicUrl(key)
    const templateUrl = pubTpl.publicUrl

    // Render
    const issuedISO = new Date().toISOString()
    const png = await renderOnTemplate(templateUrl, params.kind as 'certificate'|'membership_card', {
      name: m.full_name,
      studentId: m.student_id ?? undefined,
      issueISO: issuedISO,
    })

    // Upload
    const fileName = `${params.memberId}/${params.kind}_${Date.now()}.png`
    const { error: upErr } = await admin
      .storage.from(OUTPUT_BUCKET)
      .upload(fileName, png, { contentType: 'image/png', upsert: false })
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`)

    const { data: pubOut } = admin.storage.from(OUTPUT_BUCKET).getPublicUrl(fileName)
    imageUrl = pubOut.publicUrl
  } else {
    // Static badge
    const key = badgeKey(gender, role, m.position)
    const { data: pubBadge } = admin.storage.from(OUTPUT_BUCKET).getPublicUrl(key)
    imageUrl = pubBadge.publicUrl
  }

  // Persist credential row via RPC; returns { id, verification_code }
  const { data: created, error: cErr } = await admin.rpc('admin_issue_credential', {
    p_member_id: params.memberId,
    p_type: params.kind,
    p_name: params.name,
    p_issued_date: new Date().toISOString(),
    p_expiry_date: params.expiryISO ?? null,
    p_image_url: imageUrl,
    p_credential_data: {
      generated: needsCanvas(params.kind),
      source: needsCanvas(params.kind) ? 'template-render' : 'static-badge',
    },
  })
  if (cErr) throw new Error(`DB persist failed: ${cErr.message}`)

  return created // { id, verification_code }
}
