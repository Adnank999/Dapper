import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  console.log("next request", request)
  return await updateSession(request)
}

export const config = {
  matcher: ['/projects/create','/admin/:path*'],
}