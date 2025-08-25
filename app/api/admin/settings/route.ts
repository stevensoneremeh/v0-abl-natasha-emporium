import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const settingsSchema = z.object({
  site_name: z.string().optional(),
  site_description: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  social_facebook: z.string().url().optional().or(z.literal("")),
  social_instagram: z.string().url().optional().or(z.literal("")),
  social_twitter: z.string().url().optional().or(z.literal("")),
  social_linkedin: z.string().url().optional().or(z.literal("")),
  paystack_public_key: z.string().optional(),
  paystack_secret_key: z.string().optional(),
  maintenance_mode: z.boolean().optional(),
  allow_guest_checkout: z.boolean().optional(),
  require_email_verification: z.boolean().optional(),
  auto_approve_reviews: z.boolean().optional(),
  default_currency: z.string().optional(),
  tax_rate: z.string().optional(),
  shipping_rate: z.string().optional(),
  free_shipping_threshold: z.string().optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: settings, error } = await supabase.from("site_settings").select("*").single()

    if (error && error.code !== "PGRST116") throw error

    // Return default settings if none exist
    const defaultSettings = {
      site_name: "ABL NATASHA ENTERPRISES",
      site_description: "Luxury real estate and premium products",
      contact_email: "info@ablnatashaenterprises.com",
      contact_phone: "+1 (555) 123-4567",
      address: "123 Luxury Avenue, Premium City, PC 12345",
      social_facebook: "",
      social_instagram: "",
      social_twitter: "",
      social_linkedin: "",
      paystack_public_key: "",
      paystack_secret_key: "",
      maintenance_mode: false,
      allow_guest_checkout: true,
      require_email_verification: true,
      auto_approve_reviews: false,
      default_currency: "USD",
      tax_rate: "0.00",
      shipping_rate: "0.00",
      free_shipping_threshold: "100.00",
    }

    return NextResponse.json(settings || defaultSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const validatedData = settingsSchema.parse(body)

    const { data: settings, error } = await supabase.from("site_settings").upsert(validatedData).select().single()

    if (error) throw error

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
