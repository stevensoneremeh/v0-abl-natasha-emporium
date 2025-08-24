import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"

export const metadata = {
  title: "Admin Dashboard - ABL NATASHA ENTERPRISES",
  description: "Administrative dashboard for managing the luxury e-commerce platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-luxury-cream">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
