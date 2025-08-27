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

    // Fetch all bookings with property details
    const { data: bookings, error } = await supabase
      .from("real_estate_bookings")
      .select(`
        *,
        real_estate_properties (
          property_name,
          address
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    // Calculate stats
    const stats = {
      total: bookings?.length || 0,
      pending: bookings?.filter((b) => b.status === "pending").length || 0,
      confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
      cancelled: bookings?.filter((b) => b.status === "cancelled").length || 0,
      completed: bookings?.filter((b) => b.status === "completed").length || 0,
      totalRevenue: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
    }

    // Format bookings for response
    const formattedBookings =
      bookings?.map((booking) => ({
        id: booking.id,
        booking_reference: booking.booking_reference,
        property_name: booking.real_estate_properties?.property_name || "Unknown Property",
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        check_in: booking.check_in,
        check_out: booking.check_out,
        guests: booking.guests,
        total_amount: booking.total_amount,
        status: booking.status,
        created_at: booking.created_at,
      })) || []

    return NextResponse.json({
      bookings: formattedBookings,
      stats,
    })
  } catch (error) {
    console.error("Error in admin bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
