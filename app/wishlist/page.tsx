import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WishlistGrid } from "@/components/wishlist-grid"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function WishlistPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select(`
      *,
      products (
        *,
        categories (name)
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="text-slate-600 mt-1">Save your favorite luxury items for later</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <Heart className="h-5 w-5" />
            <span className="font-medium">{wishlistItems?.length || 0} items</span>
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlistItems && wishlistItems.length > 0 ? (
          <WishlistGrid items={wishlistItems} />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-primary/60" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Explore Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
