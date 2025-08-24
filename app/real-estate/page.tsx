import { getRealEstateProperties } from "@/lib/real-estate-client"
import { RealEstatePropertyCard } from "@/components/real-estate-property-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, Filter } from "lucide-react"
import Link from "next/link"

interface RealEstatePageProps {
  searchParams: {
    page?: string
    type?: string
    available?: string
  }
}

export const metadata = {
  title: "Real Estate - ABL NATASHA EMPORIUM",
  description:
    "Discover luxury properties and real estate investments. Book your perfect stay or find your dream property.",
}

export default async function RealEstatePage({ searchParams }: RealEstatePageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  const properties = await getRealEstateProperties({
    limit,
    offset,
    availableOnly: searchParams.available === "true",
  })

  // Get all properties for pagination count
  const allProperties = await getRealEstateProperties()
  const totalPages = Math.ceil(allProperties.length / limit)

  const availableProperties = allProperties.filter((p) => p.is_available_for_booking)
  const propertyTypes = Array.from(new Set(allProperties.map((p) => p.property_type)))

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
            <span className="text-luxury-navy font-medium">Real Estate</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-luxury-navy text-luxury-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Home className="h-8 w-8 text-luxury-gold" />
            <h1 className="font-playfair text-4xl md:text-5xl font-bold">Real Estate</h1>
          </div>

          <p className="text-xl text-luxury-cream/90 max-w-3xl mb-6">
            Discover luxury properties and exclusive real estate investments. Book your perfect stay or find your dream
            property.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Badge className="bg-luxury-gold text-luxury-navy">{properties.length} Properties</Badge>
            <Badge variant="outline" className="border-luxury-cream text-luxury-cream">
              {availableProperties.length} Available for Booking
            </Badge>
            <Badge variant="outline" className="border-luxury-cream text-luxury-cream">
              {propertyTypes.length} Property Types
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-luxury-charcoal" />
              <span className="text-sm font-medium text-luxury-charcoal">Filter by:</span>
            </div>

            <Link
              href="/real-estate"
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                !searchParams.available && !searchParams.type
                  ? "bg-luxury-gold text-luxury-navy"
                  : "bg-gray-100 text-luxury-charcoal hover:bg-gray-200"
              }`}
            >
              All Properties
            </Link>

            <Link
              href="?available=true"
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                searchParams.available === "true"
                  ? "bg-luxury-gold text-luxury-navy"
                  : "bg-gray-100 text-luxury-charcoal hover:bg-gray-200"
              }`}
            >
              Available for Booking
            </Link>

            {propertyTypes.map((type) => (
              <Link
                key={type}
                href={`?type=${type}`}
                className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                  searchParams.type === type
                    ? "bg-luxury-gold text-luxury-navy"
                    : "bg-gray-100 text-luxury-charcoal hover:bg-gray-200"
                }`}
              >
                {type}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <RealEstatePropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link href={`?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() })}`}>
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}

                  <span className="px-4 py-2 text-luxury-charcoal">
                    Page {page} of {totalPages}
                  </span>

                  {page < totalPages && (
                    <Link href={`?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() })}`}>
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-luxury-navy mb-2">No properties found</h3>
            <p className="text-luxury-charcoal mb-6">We couldn't find any properties matching your criteria.</p>
            <Link href="/real-estate">
              <Button className="btn-luxury">View All Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
