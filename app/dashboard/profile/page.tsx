import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-luxury-navy">Profile Settings</h1>
          <p className="text-luxury-charcoal mt-2">Manage your account information and preferences</p>
        </div>
        <ProfileForm user={data.user} profile={profile} />
      </div>
    </DashboardLayout>
  )
}
