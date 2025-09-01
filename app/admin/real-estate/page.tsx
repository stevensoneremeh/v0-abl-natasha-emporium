import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, MapPin, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/currency"

export const dynamic = "force-dynamic"

async function getRealEstateProperties() {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      console.error("Supabase client not properly initialized")
      return []
    }

    const { data: properties, error } = await supabase
      .from("listings_real_estate")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching real estate properties:", error)
      return []
    }

    return properties || []
  } catch (error) {
    console.error("Error in getRealEstateProperties:", error)
    return []
  }
}

async function checkAdminAccess() {
  try {
    const supabase = createServerClient()

    if (!supabase || !supabase.auth) {
      console.error("Supabase client not properly initialized")
      redirect("/auth/login")
    }

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
  } catch (error) {
    console.error("Error checking admin access:", error)
    redirect("/auth/login")
  }
}

function getListingTypeColor(type: string) {
  switch (type) {
    case "for_sale":
      return "bg-green-100 text-green-800"
    case "for_rent":
      return "bg-blue-100 text-blue-800"
    case "lease":
      return "bg-purple-100 text-purple-800"
    case "booking":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getListingTypeLabel(type: string) {
  switch (type) {
    case "for_sale":
      return "For Sale"
    case "for_rent":
      return "For Rent"
    case "lease":
      return "Lease"
    case "booking":
      return "Booking"
    default:
      return type
  }
}

export default async function AdminRealEstatePage() {
  await checkAdminAccess()
  const properties = await getRealEstateProperties()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real Estate Management</h1>
          <p className="text-muted-foreground">Manage your real estate listings, availability, and booking settings</p>
        </div>
        <Button asChild>
          <Link href="/admin/real-estate/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="mr-1 h-3 w-3" />
                    {property.location}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant={property.available ? "default" : "secondary"} className="text-xs">
                    {property.available ? "Available" : "Unavailable"}
                  </Badge>
                  <Badge className={`text-xs ${getListingTypeColor(property.listing_type)}`} variant="secondary">
                    {getListingTypeLabel(property.listing_type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center">
                      <Bed className="mr-1 h-3 w-3" />
                      {property.bedrooms}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Bath className="mr-1 h-3 w-3" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center">
                    <Square className="mr-1 h-3 w-3" />
                    {property.area} sq ft
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(property.price)}
                  {property.listing_type === "for_rent" && (
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  )}
                  {property.listing_type === "booking" && (
                    <span className="text-sm font-normal text-muted-foreground">/night</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/real-estate/${property.slug}`}>
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/admin/real-estate/${property.id}`}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No properties found</h3>
              <p className="text-muted-foreground">Get started by adding your first real estate property.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/real-estate/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
