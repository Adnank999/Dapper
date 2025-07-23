import { getUser } from '@/lib/user'
import { type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './server'

export async function updateSession(request: NextRequest) {
  console.log(`\n--- Middleware triggered at ${new Date().toISOString()} ---`)
  console.log('Incoming path:', request.nextUrl.pathname)
  console.log('Initial cookies:', request.cookies.getAll().map(c => c.name))

  let supabaseResponse = NextResponse.next({ request })
  console.log('Initial response cookies:', supabaseResponse.cookies.getAll().map(c => c.name))

  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll()
  //       },
  //       setAll(cookiesToSet) {
  //         console.log('\nCookie update detected:')
  //         cookiesToSet.forEach(({ name, value, options }) => {
  //           console.log(`Setting cookie: ${name}=${value?.slice(0, 5)}... (${options?.maxAge}s)`)
  //           request.cookies.set(name, value)
  //         })
          
  //         supabaseResponse = NextResponse.next({ request })
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           supabaseResponse.cookies.set(name, value, options)
  //         )
          
  //         console.log('Updated response cookies:', supabaseResponse.cookies.getAll().map(c => c.name))
  //       },
  //     },
  //   }
  // )

  
    try {
    console.log('\nAttempting auth check...')
    const { user, error } = await getUser();
   
    console.log('Auth check complete:')
    console.log('User exists:', !!user)
    console.log('Auth error:', error?.message || 'None')

    console.log('User role:')
    console.log('User details:', user)

    if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
      console.log('\nRedirect conditions met:')
      console.log('- No authenticated user')
      console.log(`- Current path (${request.nextUrl.pathname}) not in auth whitelist`)
      
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      console.log(`Redirecting to: ${url.toString()}`)
      return NextResponse.redirect(url)
    }
  } catch (e) {
    console.error('\nAuth check failed:', e)
    return NextResponse.json(
      { error: 'Authentication system error' },
      { status: 500 }
    )
  }

  console.log('\nFinal response cookies:', supabaseResponse.cookies.getAll().map(c => c.name))
  console.log('Returning original supabaseResponse')
  return supabaseResponse
}
