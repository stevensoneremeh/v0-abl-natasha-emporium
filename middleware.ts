import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/* Added runtime configuration for Edge compatibility */
export const runtime = "nodejs"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables in middleware")
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

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    let user = null
    try {
      /* Added null check for getUser method */
      if (supabase?.auth?.getUser) {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        user = authUser
      }
    } catch (error) {
      console.warn("Error getting user in middleware:", error)
      return supabaseResponse
    }

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user) {
        // Redirect to login if not authenticated
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/auth/login"
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
        "talktostevenson@gmail.com",
      ]

      if (!adminEmails.includes(user.email || "")) {
        // Redirect to unauthorized page
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/unauthorized"
        return NextResponse.redirect(redirectUrl)
      }

      try {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (!profile || profile.role !== "admin") {
          await supabase.from("profiles").upsert({
            id: user.id,
            role: "admin",
            updated_at: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.warn("Error handling admin profile in middleware:", error)
        // Continue without blocking the request
      }
    }

    return supabaseResponse
  } catch (error) {
    console.warn("Error in middleware:", error)
    return supabaseResponse
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
