import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { propertyId, checkIn, checkOut } = body

    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for existing bookings that overlap with the requested dates
    const { data: existingBookings, error } = await supabase
      .from("real_estate_bookings")
      .select("*")
      .eq("property_id", propertyId)
      .in("status", ["confirmed", "pending"])
      .or(
        `and(check_in.lte.${checkIn},check_out.gt.${checkIn}),and(check_in.lt.${checkOut},check_out.gte.${checkOut}),and(check_in.gte.${checkIn},check_out.lte.${checkOut})`,
      )

    if (error) {
      console.error("Error checking availability:", error)
      return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
    }

    const isAvailable = !existingBookings || existingBookings.length === 0

    // Get property details for pricing
    const { data: property, error: propertyError } = await supabase
      .from("real_estate_properties")
      .select("*, products(*)")
      .eq("id", propertyId)
      .single()

    if (propertyError) {
      console.error("Error fetching property:", propertyError)
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Calculate pricing based on dates
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const basePrice = property.products?.price || 0
    const totalPrice = basePrice * nights

    return NextResponse.json({
      available: isAvailable,
      property: {
        id: property.id,
        name: property.property_name,
        basePrice,
        nights,
        totalPrice,
      },
      conflictingBookings: existingBookings || [],
    })
  } catch (error) {
    console.error("Error in availability API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
