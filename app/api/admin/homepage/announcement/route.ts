import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user and check admin status
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get active announcement
    const { data: announcement, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching announcement:", error)
      return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 })
    }

    return NextResponse.json({ announcement: announcement || null })
  } catch (error) {
    console.error("Error in announcement API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user and check admin status
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, type, is_active, expires_at } = body

    // Deactivate existing announcements if this one is active
    if (is_active) {
      await supabase.from("announcements").update({ is_active: false }).eq("is_active", true)
    }

    // Insert new announcement
    const { data: announcement, error } = await supabase
      .from("announcements")
      .insert({
        title,
        content,
        type: type || "info",
        is_active: is_active || false,
        expires_at,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating announcement:", error)
      return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
    }

    return NextResponse.json({ announcement })
  } catch (error) {
    console.error("Error in announcement API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
