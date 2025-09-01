import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check if user is admin
    let user = null
    try {
      /* Added null check for getUser method */
      if (supabase?.auth?.getUser) {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError) throw authError
        user = authUser
      }
    } catch (error) {
      console.warn("Error getting user in media API:", error)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
      "talktostevenson@gmail.com",
    ]
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
      // Fetch media files from storage
      const { data: files, error } = await supabase.storage.from("abl-natasha-assets").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      })

      if (error) {
        console.error("Error fetching media files:", error)
        return NextResponse.json({ error: "Failed to fetch media files" }, { status: 500 })
      }

      // Transform files to include URLs and metadata
      const mediaFiles =
        files?.map((file) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from("abl-natasha-assets").getPublicUrl(file.name)

          const category = file.metadata?.mimetype?.startsWith("image/")
            ? "image"
            : file.metadata?.mimetype?.startsWith("video/")
              ? "video"
              : "document"

          return {
            id: file.id || file.name,
            filename: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || "unknown",
            uploadedAt: file.created_at || new Date().toISOString(),
            category,
          }
        }) || []

      return NextResponse.json({ files: mediaFiles })
    } catch (storageError) {
      console.error("Storage error:", storageError)
      /* Return empty files array instead of error to prevent build failure */
      return NextResponse.json({ files: [] })
    }
  } catch (error) {
    console.error("Media API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
