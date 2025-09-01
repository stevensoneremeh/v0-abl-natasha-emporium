import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get category by slug
    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
      console.error("Error fetching category:", error)
      return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error in category slug API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
