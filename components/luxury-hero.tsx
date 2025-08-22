"use client"

import { cn } from "@/lib/utils"
import { type HTMLAttributes, forwardRef } from "react"
import { LuxuryButton } from "./luxury-button"

interface LuxuryHeroProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  backgroundImage?: string
}

const LuxuryHero = forwardRef<HTMLDivElement, LuxuryHeroProps>(
  ({ className, title, subtitle, description, primaryAction, secondaryAction, backgroundImage, ...props }, ref) => {
    return (
      <div
        className={cn("relative min-h-[80vh] flex items-center justify-center text-center px-4", className)}
        ref={ref}
        {...props}
      >
        {/* Background */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div className="absolute inset-0 luxury-hero-gradient" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          {subtitle && (
            <p className="text-lg md:text-xl font-medium mb-4 opacity-90 tracking-wide uppercase">{subtitle}</p>
          )}

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">{title}</h1>

          {description && (
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">{description}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryAction && (
              <LuxuryButton
                size="lg"
                onClick={primaryAction.onClick}
                className="bg-white text-primary hover:bg-white/90"
              >
                {primaryAction.label}
              </LuxuryButton>
            )}

            {secondaryAction && (
              <LuxuryButton
                variant="outline"
                size="lg"
                onClick={secondaryAction.onClick}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                {secondaryAction.label}
              </LuxuryButton>
            )}
          </div>
        </div>
      </div>
    )
  },
)
LuxuryHero.displayName = "LuxuryHero"

export { LuxuryHero }
