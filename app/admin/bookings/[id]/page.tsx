"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Users, Clock, Mail, Phone, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"

interface BookingDetails {
  id: string
  booking_reference: string
  property_name: string
  property_address: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  guests: number
  total_amount: number
  status: string
  special_requests: string
  created_at: string
  updated_at: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchBookingDetails(params.id as string)
    }
  }, [params.id])

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
        setNewStatus(data.status)
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBooking = async () => {
    if (!booking) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNotes,
        }),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        setBooking(updatedBooking)
      }
    } catch (error) {
      console.error("Error updating booking:", error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { className: "bg-orange-100 text-orange-800", icon: Clock },
      confirmed: { className: "bg-green-100 text-green-800", icon: Calendar },
      cancelled: { className: "bg-red-100 text-red-800", icon: Clock },
      completed: { className: "bg-blue-100 text-blue-800", icon: Calendar },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config?.icon || Clock

    return (
      <Badge className={config?.className || "bg-gray-100 text-gray-800"}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-luxury-gold mx-auto mb-4 animate-pulse" />
          <p className="text-luxury-charcoal">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-luxury-charcoal mx-auto mb-4" />
        <p className="text-luxury-charcoal">Booking not found</p>
        <Button className="mt-4" asChild>
          <Link href="/admin/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Booking #{booking.booking_reference}</h1>
            <p className="text-luxury-charcoal mt-2">Manage booking details and status</p>
          </div>
        </div>
        {getStatusBadge(booking.status)}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-luxury-gold" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Property</Label>
                  <p className="text-lg font-semibold text-luxury-navy">{booking.property_name}</p>
                  <p className="text-sm text-luxury-charcoal flex items-start gap-1 mt-1">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{booking.property_address}</span>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Total Amount</Label>
                  <p className="text-lg font-semibold text-luxury-navy">{formatCurrency(booking.total_amount)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Check-in</Label>
                  <p className="text-lg font-semibold text-luxury-navy">
                    {new Date(booking.check_in).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Check-out</Label>
                  <p className="text-lg font-semibold text-luxury-navy">
                    {new Date(booking.check_out).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Guests</Label>
                  <p className="text-lg font-semibold text-luxury-navy flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {booking.guests}
                  </p>
                </div>
              </div>

              {booking.special_requests && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-luxury-charcoal">Special Requests</Label>
                    <p className="text-luxury-navy mt-1">{booking.special_requests}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-luxury-gold" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Guest Name</Label>
                  <p className="text-lg font-semibold text-luxury-navy">{booking.guest_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Email</Label>
                  <p className="text-luxury-navy flex items-center gap-1 break-all">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{booking.guest_email}</span>
                  </p>
                </div>
              </div>
              {booking.guest_phone && (
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Phone</Label>
                  <p className="text-luxury-navy flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {booking.guest_phone}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Management */}
        <div className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add internal notes about this booking..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={updateBooking} disabled={updating} className="w-full btn-luxury">
                <Save className="h-4 w-4 mr-2" />
                {updating ? "Updating..." : "Update Booking"}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Booking Created</p>
                    <p className="text-xs text-luxury-charcoal">{new Date(booking.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {booking.updated_at !== booking.created_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-luxury-charcoal">{new Date(booking.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
