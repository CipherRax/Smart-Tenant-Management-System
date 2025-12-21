import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Define protected routes
const protectedRoutes = [
  '/Dashboard',
//   '/tenants',
//   '/properties',
//   '/transactions',
//   '/maintenance',
//   '/reports',
//   '/admin',
]

// Define admin-only routes
const adminRoutes = [
  '/Dashbaord',
//   '/reports',
//   '/settings',
]

// Define tenant-only routes
const tenantRoutes = [
  '/users',
//   '/my-rent',
//   '/my-maintenance',
]

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Configure which routes use middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - auth routes (login, register, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth|api/auth).*)',
  ],
}