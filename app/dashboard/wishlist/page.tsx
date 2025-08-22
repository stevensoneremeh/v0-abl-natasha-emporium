import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WishlistGrid } from "@/components/wishlist-grid"

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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-luxury-navy">My Wishlist</h1>
          <p className="text-luxury-charcoal mt-2">Save your favorite luxury items for later</p>
        </div>
        <WishlistGrid items={wishlistItems || []} />
      </div>
    </DashboardLayout>
  )
}
