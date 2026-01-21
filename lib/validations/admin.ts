import { z } from 'zod'

/**
 * Saudi mobile phone number regex: must start with 05 and be exactly 10 digits
 */
export const SAUDI_MOBILE_REGEX = /^05\d{8}$/

/**
 * Validates a Saudi mobile phone number format
 */
export function isValidSaudiMobile(phone: string): boolean {
  return SAUDI_MOBILE_REGEX.test(phone)
}

/**
 * Validation schema for inviting new members
 */
export const inviteMemberSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .refine(
      (email) => email.endsWith('@alfaisal.edu') || email.endsWith('.alfaisal.edu'),
      { message: 'Must be an Alfaisal University email' }
    ),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  student_id: z.string()
    .min(1, 'Student ID is required'),
  phone_number: z.string()
    .regex(SAUDI_MOBILE_REGEX, 'Phone number must be a valid Saudi mobile (05XXXXXXXX)'),
  gender: z.enum(['male', 'female'], {
    message: 'Gender must be male or female'
  }),
  role: z.enum(['member', 'officer', 'admin'], {
    message: 'Invalid role'
  }),
  position: z.string().optional().nullable()
})

/**
 * Validation schema for issuing credentials
 */
export const issueCredentialSchema = z.object({
  memberId: z.string().uuid('Invalid member ID format'),
  kind: z.enum(['badge', 'certificate', 'membership_card'], {
    message: 'Invalid credential type'
  }),
  name: z.string()
    .min(1, 'Credential name is required')
    .max(200, 'Credential name too long'),
  expiryDate: z.string().datetime().optional().nullable()
})

/**
 * Validation schema for Discord verification
 */
export const discordVerifySchema = z.object({
  email: z.string().email('Invalid email format'),
  discordId: z.string().min(1, 'Discord ID is required'),
  serverGender: z.enum(['male', 'female'], {
    message: 'Invalid server gender'
  })
})

/**
 * Type exports for use in route handlers
 */
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type IssueCredentialInput = z.infer<typeof issueCredentialSchema>
export type DiscordVerifyInput = z.infer<typeof discordVerifySchema>