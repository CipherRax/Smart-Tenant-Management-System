import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/error?error=${encodeURIComponent(error)}`
    )
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}/error?error=exchange_failed`
        )
      }
      
      // Success! Redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/Dashboard`)
      
    } catch (error) {
      console.error('Unexpected error in callback:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/error?error=unexpected`
      )
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(`${requestUrl.origin}`)
}