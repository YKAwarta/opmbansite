import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles the OAuth/magic-link callback from Supabase.
 *
 * When a new member clicks their invite link the flow is:
 *   Supabase verifies the OTP → redirects here with ?code=...&type=invite
 *   → we exchange the code for a session → redirect to /set-password
 *
 * All other auth callbacks (e.g. password-reset magic links) fall through
 * to /dashboard once the session is established.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // First-time invite: send the user to choose a password
      if (type === 'invite') {
        return NextResponse.redirect(new URL('/set-password', origin))
      }
      return NextResponse.redirect(new URL('/dashboard', origin))
    }
  }

  // Something went wrong — send back to login with an error hint
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', origin))
}
