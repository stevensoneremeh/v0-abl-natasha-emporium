import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { count: wishlistCount } = await supabase
    .from("wishlist_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  return (
    <DashboardLayout>
      <DashboardOverview
        user={data.user}
        profile={profile}
        recentOrders={recentOrders || []}
        wishlistCount={wishlistCount || 0}
      />
    </DashboardLayout>
  )
}
