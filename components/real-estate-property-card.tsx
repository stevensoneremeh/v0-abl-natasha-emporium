"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Bed, Bath, Square, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { RealEstateProperty } from "@/lib/types/real-estate"
import { formatCurrency } from "@/lib/utils/currency"
import { useRouter } from "next/navigation"

interface RealEstatePropertyCardProps {
  property: RealEstateProperty
}

export function RealEstatePropertyCard({ property }: RealEstatePropertyCardProps) {
  const product = property.products
  const router = useRouter()

  if (!product) return null

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/real-estate/${product.slug}#booking`)
  }

  return (
    <Card className="card-luxury group cursor-pointer overflow-hidden h-full">
      <Link href={`/real-estate/${product.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg?height=300&width=400"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && <Badge className="bg-luxury-gold text-luxury-navy font-semibold">Featured</Badge>}
            {property.is_available_for_booking && (
              <Badge className="bg-green-500 text-white font-semibold">Available</Badge>
            )}
            <Badge className="bg-luxury-navy text-luxury-cream font-semibold capitalize">
              {property.property_type}
            </Badge>
          </div>

          {/* Virtual Tour Badge */}
          {property.virtual_tour_url && (
            <Badge className="absolute top-4 right-4 bg-blue-500 text-white font-semibold">Virtual Tour</Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
          ))}
          <span className="text-sm text-luxury-charcoal ml-2">(4.9)</span>
        </div>

        <Link href={`/real-estate/${product.slug}`}>
          <h3 className="font-semibold text-luxury-navy mb-2 line-clamp-2 hover:text-luxury-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Location */}
        {property.location_details?.city && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="h-4 w-4 text-luxury-charcoal" />
            <span className="text-sm text-luxury-charcoal">
              {property.location_details.city}
              {property.location_details.state && `, ${property.location_details.state}`}
            </span>
          </div>
        )}

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-luxury-charcoal">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} bed</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} bath</span>
            </div>
          )}
          {property.square_feet && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.square_feet.toLocaleString()} sq ft</span>
            </div>
          )}
        </div>

        {product.short_description && (
          <p className="text-sm text-luxury-charcoal/80 mb-4 line-clamp-2">{product.short_description}</p>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {property.booking_price_per_night ? (
              <div>
                <span className="font-bold text-lg text-luxury-navy">
                  {formatCurrency(property.booking_price_per_night)}
                </span>
                <span className="text-sm text-luxury-charcoal"> / night</span>
              </div>
            ) : (
              <span className="font-bold text-lg text-luxury-navy">{formatCurrency(product.price)}</span>
            )}
            {property.minimum_stay_nights > 1 && (
              <p className="text-xs text-luxury-charcoal">Min. {property.minimum_stay_nights} nights</p>
            )}
          </div>

          {property.is_available_for_booking ? (
            <Button
              size="sm"
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-navy"
              onClick={handleBookNow}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Book Now
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Not Available
            </Button>
          )}
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
