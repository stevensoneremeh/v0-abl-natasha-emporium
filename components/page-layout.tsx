"use client"

import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
  showMobileNav?: boolean
  className?: string
}

export function PageLayout({ children, showMobileNav = true, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${showMobileNav ? "pb-16 md:pb-0" : ""} ${className}`}>
      <EnhancedNavigation />
      <main className="pt-16 lg:pt-20">{children}</main>
      {showMobileNav && <MobileBottomNav />}
    </div>
  )
}
