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

    // Get testimonials from database
    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching testimonials:", error)
      return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
    }

    return NextResponse.json({ testimonials: testimonials || [] })
  } catch (error) {
    console.error("Error in testimonials API:", error)
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
    const { name, content, rating, image, position, company } = body

    // Insert testimonial
    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .insert({
        name,
        content,
        rating,
        image,
        position,
        company,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating testimonial:", error)
      return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
    }

    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error("Error in testimonials API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
