import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const next = requestUrl.searchParams.get("next") || "/dashboard"

    if (!code) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=No code provided`)
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${error.message}`)
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  } catch (error) {
    console.error("Unexpected error in auth callback:", error)
    return NextResponse.redirect(`${request.url.split("?")[0]}/login?error=An unexpected error occurred`)
  }
}
