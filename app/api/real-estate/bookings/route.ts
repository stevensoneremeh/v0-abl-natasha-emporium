import { type NextRequest, NextResponse } from "next/server"
import { createBooking } from "@/lib/real-estate"

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    const result = await createBooking({
      propertyId: bookingData.propertyId,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      nights: bookingData.nights,
      guests: bookingData.guests,
      pricePerNight: bookingData.pricePerNight,
      totalAmount: bookingData.totalAmount,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone,
      specialRequests: bookingData.specialRequests,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in booking API:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
