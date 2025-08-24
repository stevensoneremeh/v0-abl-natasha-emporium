export function calculateNights(checkInDate: string, checkOutDate: string): number {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  const timeDiff = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Client-safe booking creation function that calls API
export async function createBooking(bookingData: {
  propertyId: string
  checkInDate: string
  checkOutDate: string
  nights: number
  guests: number
  pricePerNight: number
  totalAmount: number
  guestName: string
  guestEmail: string
  guestPhone?: string
  specialRequests?: string
}): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    const response = await fetch("/api/real-estate/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      throw new Error("Failed to create booking")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    }
  }
}
