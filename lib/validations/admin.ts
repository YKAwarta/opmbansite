import { z } from 'zod'

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