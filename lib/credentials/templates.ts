export type CredentialKind = 'certificate' | 'membership_card' | 'badge'
export type Gender = 'male' | 'female'
export type Role = 'member' | 'officer' | 'admin'

export function positionSlug(position?: string | null): string | null {
  if (!position) return null
  const map: Record<string, string> = {
    'President': 'president',
    'Financial Officer': 'financial-officer',
    'Operations Officer': 'operations-officer',
    'Media Officer': 'media-officer',
    'Strategic Relations Officer': 'relations-officer',
  }
  return map[position] ?? null
}

export function templateKeyForTemplate(
  kind: Exclude<CredentialKind, 'badge'>,
  gender: Gender,
  role: Role,
  position?: string | null
): string {
  const pos = positionSlug(position)
  const base = kind === 'membership_card' ? 'card' : 'certificate'

  if (role === 'member' || !pos) {
    return kind === 'membership_card'
      ? `cards/${base}-member-${gender}.png`
      : `certificates/${base}-member-${gender}.png`
  }

  return kind === 'membership_card'
    ? `cards/${base}-${pos}-${gender}.png`
    : `certificates/${base}-${pos}-${gender}.png`
}

export function badgeKey(
  gender: Gender,
  role: Role,
  position?: string | null
): string {
  if (position === 'President') {
    return `badges/president-${gender}.png`
  }
  const byPosition: Record<string, string> = {
    'Strategic Relations Officer': 'relations.png',
    'Financial Officer':           'financial.png',
    'Operations Officer':          'operations.png',
    'Media Officer':               'media.png',
  }
  const file = position ? byPosition[position] : undefined
  return `badges/${file ?? 'member.png'}`
}
