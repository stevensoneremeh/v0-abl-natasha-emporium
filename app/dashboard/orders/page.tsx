import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrderHistory } from "@/components/order-history"

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (name, images)
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-luxury-navy">Order History</h1>
          <p className="text-luxury-charcoal mt-2">Track your orders and view purchase history</p>
        </div>
        <OrderHistory orders={orders || []} />
      </div>
    </DashboardLayout>
  )
}
