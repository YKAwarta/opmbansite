import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Helper to create redirect with proper cookie handling
  const createRedirect = (pathname: string) => {
    const url = request.nextUrl.clone()
    url.pathname = pathname
    const redirectResponse = NextResponse.redirect(url)
    // Copy all cookies from supabaseResponse to the redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Protected routes - require authentication
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    if (!user) {
      return createRedirect('/login')
    }

    if (path.startsWith('/admin')) {
      const { data: isAdmin } = await supabase.rpc('is_admin')
      if (!isAdmin) {
        return createRedirect('/dashboard')
      }
    }
  }

  // Redirect authenticated users away from login page
  if (path === '/login' && user) {
    return createRedirect('/dashboard')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
