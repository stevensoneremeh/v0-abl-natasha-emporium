import { getRealEstatePropertyBySlug } from "@/lib/real-estate-client"
import { BookingForm } from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Star,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  Shield,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface RealEstatePropertyPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: RealEstatePropertyPageProps) {
  const property = await getRealEstatePropertyBySlug(params.slug)

  if (!property || !property.products) {
    return {
      title: "Property Not Found",
    }
  }

  return {
    title: `${property.products.name} - Real Estate - ABL NATASHA EMPORIUM`,
    description: property.products.short_description || property.products.description,
  }
}

async function PropertyContent({ params }: RealEstatePropertyPageProps) {
  const property = await getRealEstatePropertyBySlug(params.slug)

  if (!property || !property.products) {
    notFound()
  }

  const product = property.products

  // Icon mapping for amenities
  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    kitchen: Utensils,
    tv: Tv,
    "air conditioning": Wind,
    security: Shield,
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-luxury-charcoal hover:text-luxury-gold">
              Home
            </Link>
            <span className="text-luxury-charcoal">/</span>
            <Link href="/real-estate" className="text-luxury-charcoal hover:text-luxury-gold">
              Real Estate
            </Link>
            <span className="text-luxury-charcoal">/</span>
            <span className="text-luxury-navy font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/real-estate">
            <Button variant="ghost" size="sm" className="text-luxury-charcoal hover:text-luxury-gold">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Real Estate
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Property Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-luxury-gold text-luxury-gold" />
                ))}
                <span className="text-sm text-luxury-charcoal ml-2">4.9 (18 reviews)</span>
              </div>

              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-luxury-navy mb-4">{product.name}</h1>

              {/* Location */}
              {property.location_details?.city && (
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-luxury-gold" />
                  <span className="text-lg text-luxury-charcoal">
                    {property.location_details.city}
                    {property.location_details.state && `, ${property.location_details.state}`}
                    {property.location_details.country && `, ${property.location_details.country}`}
                  </span>
                </div>
              )}

              {/* Property Details */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-luxury-gold" />
                    <span className="font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-luxury-gold" />
                    <span className="font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-luxury-gold" />
                    <span className="font-medium">{property.square_feet.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-luxury-navy text-luxury-cream capitalize">{property.property_type}</Badge>
                {product.is_featured && <Badge className="bg-luxury-gold text-luxury-navy">Featured</Badge>}
                {property.is_available_for_booking && <Badge className="bg-green-500 text-white">Available</Badge>}
                {property.year_built && <Badge variant="secondary">Built {property.year_built}</Badge>}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white">
                <Image
                  src={product.images[0] || "/placeholder.svg?height=600&width=800"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-white">
                      <Image
                        src={image || "/placeholder.svg?height=200&width=200"}
                        alt={`${product.name} ${index + 2}`}
                        fill
                        className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-4">About This Property</h2>
                  <div className="prose prose-lg max-w-none text-luxury-charcoal">
                    <p>{product.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity.toLowerCase()] || Calendar
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-luxury-gold" />
                          <span className="capitalize">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Virtual Tour */}
            {property.virtual_tour_url && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-4">Virtual Tour</h2>
                  <Button className="btn-luxury" asChild>
                    <Link href={property.virtual_tour_url} target="_blank" rel="noopener noreferrer">
                      Take Virtual Tour
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {property.is_available_for_booking ? (
                <BookingForm
                  property={property}
                  onBookingComplete={(bookingId) => {
                    // TODO: Navigate to booking confirmation page
                    console.log("Booking completed:", bookingId)
                  }}
                />
              ) : (
                <Card className="card-luxury">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-luxury-navy mb-2">Not Available for Booking</h3>
                    <p className="text-luxury-charcoal mb-4">
                      This property is currently not available for booking. Contact us for more information.
                    </p>
                    <Button className="btn-luxury w-full">Contact Us</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RealEstatePropertyPage(props: RealEstatePropertyPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-luxury-charcoal">Loading property...</p>
          </div>
        </div>
      }
    >
      <PropertyContent {...props} />
    </Suspense>
  )
}
