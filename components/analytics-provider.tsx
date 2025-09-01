"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void
  trackPageView: (path: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      // Add your analytics service here (e.g., Google Analytics, Mixpanel)
      console.log("Track event:", event, properties)

      // Example: Google Analytics 4
      if ((window as any).gtag) {
        ;(window as any).gtag("event", event, properties)
      }
    }
  }

  const trackPageView = (path: string) => {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      console.log("Track page view:", path)

      // Example: Google Analytics 4
      if ((window as any).gtag) {
        ;(window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
          page_path: path,
        })
      }
    }
  }

  useEffect(() => {
    // Track initial page load
    trackPageView(window.location.pathname)
  }, [])

  return <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider")
  }
  return context
}
