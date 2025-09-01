import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"

/* Created missing profile upload-image API route to fix 401 Unauthorized errors */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    let user = null
    try {
      if (supabase?.auth?.getUser) {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError) throw authError
        user = authUser
      }
    } catch (error) {
      console.warn("Error getting user in profile upload:", error)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB max for profile images)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const filename = `profiles/${user.id}/${timestamp}-${randomString}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Update user profile with new avatar URL
    try {
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: blob.url }).eq("id", user.id)

      if (updateError) {
        console.warn("Error updating profile avatar:", updateError)
        // Continue anyway, file is uploaded
      }
    } catch (dbError) {
      console.warn("Database error updating avatar:", dbError)
      // Continue anyway, file is uploaded
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Profile upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
