import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieKV = { name: string; value: string }
type CookieWrite = { name: string; value: string; options: CookieOptions }

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const setCookiesBuffer: CookieWrite[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): CookieKV[] {
          const list = request.cookies.getAll()
          return list.map((ck): CookieKV => ({ name: ck.name, value: ck.value }))
        },
        setAll(cookiesToSet: CookieWrite[]) {
          cookiesToSet.forEach((ck) => {
            setCookiesBuffer.push(ck)
            response.cookies.set({ name: ck.name, value: ck.value, ...ck.options })
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    if (!user) {
      const redirect = NextResponse.redirect(new URL('/login', request.url))
      setCookiesBuffer.forEach((ck) => redirect.cookies.set({ name: ck.name, value: ck.value, ...ck.options }))
      return redirect
    }

    if (path.startsWith('/admin')) {
      const { data: isAdmin } = await supabase.rpc('is_admin')
      if (!isAdmin) {
        const redirect = NextResponse.redirect(new URL('/dashboard', request.url))
        setCookiesBuffer.forEach((ck) => redirect.cookies.set({ name: ck.name, value: ck.value, ...ck.options }))
        return redirect
      }
    }
  }

  if (path === '/login' && user) {
    const redirect = NextResponse.redirect(new URL('/dashboard', request.url))
    setCookiesBuffer.forEach((ck) => redirect.cookies.set({ name: ck.name, value: ck.value, ...ck.options }))
    return redirect
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
