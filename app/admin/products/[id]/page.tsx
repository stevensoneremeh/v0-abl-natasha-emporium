import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Package, DollarSign, BarChart3, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils/currency"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || ["talktostevenson@gmail.com"]
  if (!adminEmails.includes(user.email!)) {
    redirect("/unauthorized")
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("id", id)
    .single()

  if (error || !product) {
    redirect("/admin/products")
  }

  return product
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-luxury-navy font-playfair">{product.name}</h1>
            <p className="text-luxury-charcoal">Product Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/edit/${product.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Link>
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.images.map((image: string, index: number) => (
                    <div key={index} className="relative h-64 overflow-hidden rounded-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">SKU</Label>
                  <p className="text-luxury-navy font-medium">{product.sku || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Category</Label>
                  <p className="text-luxury-navy font-medium">{product.categories?.name || "Uncategorized"}</p>
                </div>
              </div>

              {product.description && (
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Description</Label>
                  <p className="text-luxury-navy mt-1">{product.description}</p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-luxury-charcoal">Specifications</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-luxury-cream/50 rounded">
                        <span className="font-medium">{key}</span>
                        <span className="text-luxury-charcoal">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Stats */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Product Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-luxury-gold" />
                  <span className="text-sm text-luxury-charcoal">Price</span>
                </div>
                <span className="font-bold text-luxury-navy">{formatCurrency(product.price)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-luxury-gold" />
                  <span className="text-sm text-luxury-charcoal">Stock</span>
                </div>
                <span className="font-medium text-luxury-navy">{product.stock_quantity}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-luxury-gold" />
                  <span className="text-sm text-luxury-charcoal">Low Stock Alert</span>
                </div>
                <span className="font-medium text-luxury-navy">{product.low_stock_threshold || 5}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-luxury-gold" />
                  <span className="text-sm text-luxury-charcoal">Created</span>
                </div>
                <span className="font-medium text-luxury-navy">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-luxury-charcoal">Status</span>
                <Badge className={product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-luxury-charcoal">Featured</span>
                <Badge
                  className={product.is_featured ? "bg-luxury-gold text-luxury-navy" : "bg-gray-100 text-gray-800"}
                >
                  {product.is_featured ? "Featured" : "Not Featured"}
                </Badge>
              </div>

              {product.stock_quantity <= (product.low_stock_threshold || 5) && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">Low Stock Warning</p>
                  <p className="text-xs text-orange-600 mt-1">Only {product.stock_quantity} items remaining</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href={`/products/${product.slug || product.id}`} target="_blank">
                  View on Store
                </Link>
              </Button>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href={`/admin/products/edit/${product.id}`}>Edit Product</Link>
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                Duplicate Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
