import {createServerClient, type CookieOptions} from "@supabase/ssr"
import {NextResponse, type NextRequest} from 'next/server'

export async function middleware(request: NextRequest){
    let response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
        {
            cookies: {
                get(name: string){
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions){
                    response.cookies.set({name, value, ...options})
                },
                remove(name: string, options: CookieOptions){
                    response.cookies.set({name, value: '', ...options, maxAge: 0})
                },
            },
        }
    )

    const {data: {user}} = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    if(path.startsWith('/dashboard') || path.startsWith('/admin')){
        if(!user){
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if(path.startsWith('/admin')){
            const{data: isAdmin} = await supabase.rpc('is_admin')
            if(!isAdmin){
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }
    }

    if(path === '/login' && user){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login']
}