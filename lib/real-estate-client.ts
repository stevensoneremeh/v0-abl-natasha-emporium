import type { RealEstateProperty, RealEstateBooking } from "@/lib/real-estate"

// Client-safe functions that use API routes instead of direct database access
export async function getRealEstateProperties(
  options: {
    limit?: number
    offset?: number
    availableOnly?: boolean
  } = {},
): Promise<RealEstateProperty[]> {
  try {
    const params = new URLSearchParams()
    if (options.limit) params.set("limit", options.limit.toString())
    if (options.offset) params.set("offset", options.offset.toString())
    if (options.availableOnly) params.set("availableOnly", "true")

    const response = await fetch(`/api/real-estate/properties?${params}`)
    if (!response.ok) {
      console.error("[v0] Failed to fetch properties:", response.status, response.statusText)
      throw new Error("Failed to fetch properties")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching real estate properties:", error)
    return []
  }
}

export async function getRealEstatePropertyBySlug(slug: string): Promise<RealEstateProperty | null> {
  try {
    console.log("[v0] Fetching property by slug:", slug)
    const response = await fetch(`/api/real-estate/properties/${slug}`)

    if (response.status === 404) {
      console.log("[v0] Property not found:", slug)
      return null
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("[v0] API error:", response.status, errorData)
      throw new Error(errorData.error || "Failed to fetch property")
    }

    const data = await response.json()
    console.log("[v0] Successfully fetched property:", data.id)
    return data
  } catch (error) {
    console.error("[v0] Error fetching real estate property:", error)
    throw error
  }
}

export async function checkAvailability(
  propertyId: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/real-estate/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, checkInDate, checkOutDate }),
    })

    if (!response.ok) return false
    const data = await response.json()
    return data.available
  } catch (error) {
    console.error("Error checking availability:", error)
    return false
  }
}

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error }
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, error: "Failed to create booking" }
  }
}

export async function getBookingsByEmail(email: string): Promise<RealEstateBooking[]> {
  try {
    const response = await fetch(`/api/real-estate/bookings?email=${encodeURIComponent(email)}`)
    if (!response.ok) return []

    return await response.json()
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

// Utility functions that don't require server access
export function calculateNights(checkInDate: string, checkOutDate: string): number {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  const timeDiff = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// Re-export types for convenience
export type { RealEstateProperty, RealEstateBooking }
