import { getProductBySlug, getProductsByCategory } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - ABL NATASHA EMPORIUM`,
    description: product.meta_description || product.short_description || product.description,
  }
}

async function ProductContent({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await getProductsByCategory(product.category_id, {
    limit: 4,
  })
  const filteredRelatedProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

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
            {product.categories && (
              <>
                <Link
                  href={`/categories/${product.categories.slug}`}
                  className="text-luxury-charcoal hover:text-luxury-gold"
                >
                  {product.categories.name}
                </Link>
                <span className="text-luxury-charcoal">/</span>
              </>
            )}
            <span className="text-luxury-navy font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={product.categories ? `/categories/${product.categories.slug}` : "/"}>
            <Button variant="ghost" size="sm" className="text-luxury-charcoal hover:text-luxury-gold">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {product.categories?.name || "Home"}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <Image
                src={product.images[0] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-luxury-gold text-luxury-navy font-semibold">Featured</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white font-semibold">-{discountPercentage}% OFF</Badge>
                )}
                {product.stock_quantity <= product.low_stock_threshold && (
                  <Badge className="bg-orange-500 text-white font-semibold">Low Stock</Badge>
                )}
              </div>
            </div>

            {/* Additional Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-white">
                    <Image
                      src={image || "/placeholder.svg?height=150&width=150"}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-luxury-gold text-luxury-gold" />
                ))}
                <span className="text-sm text-luxury-charcoal ml-2">4.8 (24 reviews)</span>
              </div>

              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-luxury-navy mb-4">{product.name}</h1>

              {product.short_description && (
                <p className="text-lg text-luxury-charcoal mb-4">{product.short_description}</p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-3xl text-luxury-navy">{formatPrice(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-xl text-luxury-charcoal line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {product.sku && <p className="text-sm text-luxury-charcoal mb-4">SKU: {product.sku}</p>}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-luxury-navy mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button className="btn-luxury flex-1 text-lg py-6">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="px-6 bg-transparent">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-6 bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="outline" className="w-full text-lg py-6 bg-transparent">
                Buy Now
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-luxury-gold" />
                <div>
                  <p className="font-medium text-luxury-navy">Free Shipping</p>
                  <p className="text-sm text-luxury-charcoal">On orders over ₦50,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-luxury-gold" />
                <div>
                  <p className="font-medium text-luxury-navy">Secure Payment</p>
                  <p className="text-sm text-luxury-charcoal">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-luxury-gold" />
                <div>
                  <p className="font-medium text-luxury-navy">Easy Returns</p>
                  <p className="text-sm text-luxury-charcoal">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-16">
            <Card>
              <CardContent className="p-8">
                <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-6">Product Description</h2>
                <div className="prose prose-lg max-w-none text-luxury-charcoal">
                  <p>{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-6">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-luxury-navy">{key}</span>
                      <span className="text-luxury-charcoal">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-playfair text-3xl font-bold text-luxury-navy mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} showCategory={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-luxury-charcoal">Loading product...</p>
          </div>
        </div>
      }
    >
      <ProductContent {...props} />
    </Suspense>
  )
}
