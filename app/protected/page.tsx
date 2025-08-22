import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 min-h-screen bg-luxury-cream">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="font-playfair text-4xl font-bold text-luxury-navy mb-8">Welcome to Your Dashboard</h1>
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-luxury-navy mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-luxury-charcoal">Email</label>
              <p className="text-luxury-navy">{data.user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-luxury-charcoal">User ID</label>
              <p className="text-luxury-navy font-mono text-sm">{data.user.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-luxury-charcoal">Account Created</label>
              <p className="text-luxury-navy">{new Date(data.user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
