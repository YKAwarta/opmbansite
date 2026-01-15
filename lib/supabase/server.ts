import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieKV = { name: string; value: string }
type CookieWrite = { name: string; value: string; options: CookieOptions }

export async function createClient() {
  const store = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): CookieKV[] {
          return store.getAll().map((c) => ({ name: c.name, value: c.value }))
        },
        setAll(cookiesToSet: CookieWrite[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set({ name, value, ...options })
            })
          } catch (error){
            if (process.env.NODE_ENV === 'development'){
              console.warn('Cookie set warning (may be expected):', error instanceof Error ? error.message : 'Unknown error')
            }
          }
        },
      },
    }
  )
}
