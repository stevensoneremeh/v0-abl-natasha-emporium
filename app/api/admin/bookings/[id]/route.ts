import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Fetch booking details
    const { data: booking, error } = await supabase
      .from("real_estate_bookings")
      .select(`
        *,
        real_estate_properties (
          property_name,
          address,
          description
        )
      `)
      .eq("id", params.id)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Format booking for response
    const formattedBooking = {
      id: booking.id,
      booking_reference: booking.booking_reference,
      property_name: booking.real_estate_properties?.property_name || "Unknown Property",
      property_address: booking.real_estate_properties?.address || "Address not available",
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      guest_phone: booking.guest_phone,
      check_in: booking.check_in,
      check_out: booking.check_out,
      guests: booking.guests,
      total_amount: booking.total_amount,
      status: booking.status,
      special_requests: booking.special_requests,
      admin_notes: booking.admin_notes,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    }

    return NextResponse.json(formattedBooking)
  } catch (error) {
    console.error("Error fetching booking details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { status, admin_notes } = body

    // Update booking
    const { data: booking, error } = await supabase
      .from("real_estate_bookings")
      .update({
        status,
        admin_notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select(`
        *,
        real_estate_properties (
          property_name,
          address
        )
      `)
      .single()

    if (error) {
      console.error("Error updating booking:", error)
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in booking update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
