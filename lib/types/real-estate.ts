import type { Product } from "./database"

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
