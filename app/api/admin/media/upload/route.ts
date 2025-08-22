import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
      "talktostevenson@gmail.com",
    ]
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const filename = `${category}/${timestamp}-${randomString}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Store metadata in database
    const { data: mediaRecord, error: dbError } = await supabase
      .from("media_files")
      .insert({
        filename: file.name,
        url: blob.url,
        size: file.size,
        type: file.type,
        category,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Error saving media record:", dbError)
      // Continue anyway, file is uploaded
    }

    return NextResponse.json({
      id: mediaRecord?.id || filename,
      filename: file.name,
      url: blob.url,
      size: file.size,
      type: file.type,
      category,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
