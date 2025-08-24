"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Phone, Mail, User, MessageSquare, CreditCard } from "lucide-react"
import type { RealEstateProperty } from "@/lib/types/real-estate"
import { calculateNights, formatCurrency, createBooking } from "@/lib/utils/real-estate"

interface BookingFormProps {
  property: RealEstateProperty
  onBookingComplete?: (bookingId: string) => void
}

export function BookingForm({ property, onBookingComplete }: BookingFormProps) {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const nights =
    formData.checkInDate && formData.checkOutDate ? calculateNights(formData.checkInDate, formData.checkOutDate) : 0
  const pricePerNight = property.booking_price_per_night || 0
  const subtotal = nights * pricePerNight
  const serviceFee = subtotal * 0.1 // 10% service fee
  const totalAmount = subtotal + serviceFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validate form
      if (!formData.checkInDate || !formData.checkOutDate) {
        throw new Error("Please select check-in and check-out dates")
      }

      if (nights < property.minimum_stay_nights) {
        throw new Error(`Minimum stay is ${property.minimum_stay_nights} nights`)
      }

      if (!formData.guestName || !formData.guestEmail) {
        throw new Error("Please provide guest name and email")
      }

      // Create booking
      const result = await createBooking({
        propertyId: property.id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        nights,
        guests: formData.guests,
        pricePerNight,
        totalAmount,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        specialRequests: formData.specialRequests,
      })

      if (result.success && result.bookingId) {
        onBookingComplete?.(result.bookingId)
      } else {
        throw new Error(result.error || "Failed to create booking")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]
  // Get minimum checkout date (day after checkin)
  const minCheckoutDate = formData.checkInDate
    ? new Date(new Date(formData.checkInDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : today

  return (
    <Card className="card-luxury">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-luxury-navy">
          <Calendar className="h-5 w-5 text-luxury-gold" />
          Book Your Stay
        </CardTitle>
        {property.booking_price_per_night && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-luxury-navy">
              {formatCurrency(property.booking_price_per_night)}
            </span>
            <span className="text-luxury-charcoal">per night</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input
                id="checkIn"
                type="date"
                min={today}
                value={formData.checkInDate}
                onChange={(e) => updateFormData("checkInDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input
                id="checkOut"
                type="date"
                min={minCheckoutDate}
                value={formData.checkOutDate}
                onChange={(e) => updateFormData("checkOutDate", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max="10"
              value={formData.guests}
              onChange={(e) => updateFormData("guests", Number.parseInt(e.target.value))}
              required
            />
          </div>

          {/* Minimum Stay Warning */}
          {nights > 0 && nights < property.minimum_stay_nights && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-md text-sm">
              Minimum stay is {property.minimum_stay_nights} nights. Please adjust your dates.
            </div>
          )}

          {/* Pricing Breakdown */}
          {nights > 0 && nights >= property.minimum_stay_nights && (
            <div className="bg-luxury-cream/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {formatCurrency(pricePerNight)} × {nights} nights
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-luxury-navy">Guest Information</h3>

            <div className="space-y-2">
              <Label htmlFor="guestName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="guestName"
                value={formData.guestName}
                onChange={(e) => updateFormData("guestName", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => updateFormData("guestEmail", e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number (Optional)
              </Label>
              <Input
                id="guestPhone"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => updateFormData("guestPhone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Special Requests (Optional)
              </Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => updateFormData("specialRequests", e.target.value)}
                placeholder="Any special requests or requirements?"
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || nights < property.minimum_stay_nights}
            className="w-full btn-luxury text-lg py-6"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Reserve & Pay {nights > 0 ? formatCurrency(totalAmount) : ""}
              </>
            )}
          </Button>

          <p className="text-xs text-luxury-charcoal text-center">
            You won't be charged yet. Review your booking details on the next page.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
