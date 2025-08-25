import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    if (!adminEmails.includes(user.email!)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: userProfile, error } = await supabase.from("profiles").select("*").eq("id", params.id).single()

    if (error) throw error

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
}
