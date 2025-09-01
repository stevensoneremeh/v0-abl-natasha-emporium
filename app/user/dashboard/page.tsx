import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ShoppingCart, Heart, Settings } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getUserStats() {
  try {
    const supabase = await createClient()

    if (!supabase || !supabase.auth || typeof supabase.auth.getUser !== "function") {
      console.error("Supabase client not properly initialized")
      return {
        user: null,
        totalOrders: 0,
        wishlistItems: 0,
        recentOrders: [],
      }
    }

    let user = null
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (authError) {
      console.error("Error getting user:", authError)
      return {
        user: null,
        totalOrders: 0,
        wishlistItems: 0,
        recentOrders: [],
      }
    }

    if (!user) {
      redirect("/auth/login")
    }

    // Get user stats with error handling
    const [{ count: totalOrders }, { count: wishlistItems }, { data: recentOrders }] = await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("wishlist_items").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
    ])

    return {
      user,
      totalOrders: totalOrders || 0,
      wishlistItems: wishlistItems || 0,
      recentOrders: recentOrders || [],
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      user: null,
      totalOrders: 0,
      wishlistItems: 0,
      recentOrders: [],
    }
  }
}

export default async function UserDashboard() {
  const stats = await getUserStats()

  if (!stats.user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {stats.user.user_metadata?.full_name || stats.user.email}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/user/profile">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wishlistItems}</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(stats.user.created_at).getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{order.total_amount}</p>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/user/orders">View All Orders</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/user/orders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                My Orders
              </CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/user/wishlist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                My Wishlist
              </CardTitle>
              <CardDescription>View your saved items</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/user/profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                My Profile
              </CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}
