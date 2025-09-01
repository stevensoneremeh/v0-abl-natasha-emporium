import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables in middleware")
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/auth/login"
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
        "talktostevenson@gmail.com",
      ]

      if (!adminEmails.includes(user.email || "")) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/unauthorized"
        return NextResponse.redirect(redirectUrl)
      }
    }
  } catch (error) {
    console.error("[v0] Middleware error:", error)
  }

  return supabaseResponse
}
