import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/database"

export interface RealEstateProperty {
  id: string
  product_id: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  square_feet: number | null
  lot_size: number | null
  year_built: number | null
  amenities: string[]
  location_details: Record<string, any>
  virtual_tour_url: string | null
  floor_plans: string[]
  is_available_for_booking: boolean
  booking_price_per_night: number | null
  minimum_stay_nights: number
  created_at: string
  updated_at: string
  products?: Product
}

export interface RealEstateBooking {
  id: string
  user_id: string | null
  property_id: string
  booking_reference: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  check_in_date: string
  check_out_date: string
  nights: number
  guests: number
  price_per_night: number
  total_amount: number
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_reference: string | null
  guest_name: string
  guest_email: string
  guest_phone: string | null
  special_requests: string | null
  created_at: string
  updated_at: string
}

export async function getRealEstateProperties(
  options: {
    limit?: number
    offset?: number
    availableOnly?: boolean
  } = {},
): Promise<RealEstateProperty[]> {
  const supabase = createClient()

  let query = supabase
    .from("real_estate_properties")
    .select(`
      *,
      products (
        id,
        name,
        slug,
        description,
        short_description,
        price,
        images,
        features,
        is_featured,
        is_active
      )
    `)
    .eq("products.is_active", true)

  if (options.availableOnly) {
    query = query.eq("is_available_for_booking", true)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching real estate properties:", error)
    return []
  }

  return data || []
}

export async function getRealEstatePropertyBySlug(slug: string): Promise<RealEstateProperty | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("real_estate_properties")
    .select(`
      *,
      products!inner (
        id,
        name,
        slug,
        description,
        short_description,
        price,
        images,
        features,
        is_featured,
        is_active,
        categories (
          id,
          name,
          slug
        )
      )
    `)
    .eq("products.slug", slug)
    .eq("products.is_active", true)
    .limit(1)

  if (error) {
    console.error("Error fetching real estate property:", error)
    throw new Error(`Database query failed: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return null
  }

  return data[0]
}

export async function checkAvailability(
  propertyId: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("real_estate_bookings")
    .select("id")
    .eq("property_id", propertyId)
    .in("status", ["pending", "confirmed"])
    .or(
      `and(check_in_date.lte.${checkInDate},check_out_date.gt.${checkInDate}),and(check_in_date.lt.${checkOutDate},check_out_date.gte.${checkOutDate}),and(check_in_date.gte.${checkInDate},check_out_date.lte.${checkOutDate})`,
    )

  if (error) {
    console.error("Error checking availability:", error)
    return false
  }

  return data.length === 0
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
  const supabase = createClient()

  // Generate booking reference
  const bookingReference = `RE${Date.now().toString().slice(-8)}`

  const { data, error } = await supabase
    .from("real_estate_bookings")
    .insert({
      property_id: bookingData.propertyId,
      booking_reference: bookingReference,
      check_in_date: bookingData.checkInDate,
      check_out_date: bookingData.checkOutDate,
      nights: bookingData.nights,
      guests: bookingData.guests,
      price_per_night: bookingData.pricePerNight,
      total_amount: bookingData.totalAmount,
      guest_name: bookingData.guestName,
      guest_email: bookingData.guestEmail,
      guest_phone: bookingData.guestPhone,
      special_requests: bookingData.specialRequests,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating booking:", error)
    return { success: false, error: error.message }
  }

  return { success: true, bookingId: data.id }
}

export async function getBookingsByEmail(email: string): Promise<RealEstateBooking[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("real_estate_bookings")
    .select("*")
    .eq("guest_email", email)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

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
