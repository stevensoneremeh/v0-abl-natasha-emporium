"use client"

import { cn } from "@/lib/utils"
import { type HTMLAttributes, forwardRef } from "react"

interface LuxuryCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  gradient?: boolean
}

const LuxuryCard = forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, hover = true, gradient = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-card border border-border rounded-lg shadow-lg transition-all duration-300",
          {
            "hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10": hover,
            "luxury-gradient text-white": gradient,
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  },
)
LuxuryCard.displayName = "LuxuryCard"

const LuxuryCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
LuxuryCardHeader.displayName = "LuxuryCardHeader"

const LuxuryCardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-serif text-2xl font-bold leading-none tracking-tight", className)} {...props} />
  ),
)
LuxuryCardTitle.displayName = "LuxuryCardTitle"

const LuxuryCardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  ),
)
LuxuryCardDescription.displayName = "LuxuryCardDescription"

const LuxuryCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
LuxuryCardContent.displayName = "LuxuryCardContent"

const LuxuryCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
LuxuryCardFooter.displayName = "LuxuryCardFooter"

export { LuxuryCard, LuxuryCardHeader, LuxuryCardTitle, LuxuryCardDescription, LuxuryCardContent, LuxuryCardFooter }
