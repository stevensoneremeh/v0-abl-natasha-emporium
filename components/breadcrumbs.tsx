"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  if (breadcrumbItems.length <= 1) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-2 text-sm text-luxury-charcoal mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <Link href="/" className="flex items-center hover:text-luxury-gold transition-colors" aria-label="Home">
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2"
        >
          <ChevronRight className="h-4 w-4 text-luxury-charcoal/50" />
          {item.isCurrentPage ? (
            <span className="font-medium text-luxury-navy" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className="hover:text-luxury-gold transition-colors">
              {item.label}
            </Link>
          )}
        </motion.div>
      ))}
    </motion.nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Format segment for display
    let label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Special cases for common routes
    if (segment === "real-estate") label = "Real Estate"
    if (segment === "hair-wigs") label = "Hair & Wigs"

    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: isLast,
    })
  })

  return breadcrumbs
}
