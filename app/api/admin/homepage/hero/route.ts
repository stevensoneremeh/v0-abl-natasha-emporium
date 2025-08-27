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

    // Get hero section data
    const { data: hero, error } = await supabase
      .from("hero_sections")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching hero section:", error)
      return NextResponse.json({ error: "Failed to fetch hero section" }, { status: 500 })
    }

    return NextResponse.json({ hero: hero || null })
  } catch (error) {
    console.error("Error in hero API:", error)
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
    const { title, subtitle, description, background_image, background_video, cta_text, cta_link, is_active } = body

    // Deactivate existing hero sections if this one is active
    if (is_active) {
      await supabase.from("hero_sections").update({ is_active: false }).eq("is_active", true)
    }

    // Insert new hero section
    const { data: hero, error } = await supabase
      .from("hero_sections")
      .insert({
        title,
        subtitle,
        description,
        background_image,
        background_video,
        cta_text,
        cta_link,
        is_active: is_active || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating hero section:", error)
      return NextResponse.json({ error: "Failed to create hero section" }, { status: 500 })
    }

    return NextResponse.json({ hero })
  } catch (error) {
    console.error("Error in hero API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
