import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { RealEstatePropertyForm } from "@/components/admin/real-estate-property-form"

async function getRealEstateProperty(id: string) {
  const supabase = createServerClient()

  const { data: property, error } = await supabase.from("listings_real_estate").select("*").eq("id", id).single()

  if (error || !property) {
    return null
  }

  return property
}

async function checkAdminAccess() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin, role").eq("id", user.id).single()

  if (!profile?.is_admin && profile?.role !== "admin") {
    redirect("/unauthorized")
  }

  return user
}

export default async function AdminRealEstatePropertyPage({
  params,
}: {
  params: { id: string }
}) {
  await checkAdminAccess()
  const property = await getRealEstateProperty(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/real-estate">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
            <p className="text-muted-foreground">Manage listing details, availability, and booking settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/real-estate/${property.slug}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading form...</div>}>
            <RealEstatePropertyForm property={property} />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Status</CardTitle>
              <CardDescription>Current listing status and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Availability</Label>
                <Badge variant={property.available ? "default" : "secondary"}>
                  {property.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Listing Type</Label>
                <Badge variant="outline">
                  {property.listing_type === "for_sale" && "For Sale"}
                  {property.listing_type === "for_rent" && "For Rent"}
                  {property.listing_type === "lease" && "Lease"}
                  {property.listing_type === "booking" && "Booking"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Badge variant={property.featured ? "default" : "secondary"}>
                  {property.featured ? "Featured" : "Not Featured"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Key property information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Property Type</span>
                <span className="text-sm font-medium">{property.property_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bedrooms</span>
                <span className="text-sm font-medium">{property.bedrooms || "Studio"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bathrooms</span>
                <span className="text-sm font-medium">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Area</span>
                <span className="text-sm font-medium">{property.area} sq ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-sm font-medium">
                  ${property.price?.toLocaleString()}
                  {property.listing_type === "for_rent" && "/month"}
                  {property.listing_type === "booking" && "/night"}
                </span>
              </div>
            </CardContent>
          </Card>

          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
