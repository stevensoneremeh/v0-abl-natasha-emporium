"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("[v0] LCP:", entry.startTime)

            // Send to monitoring service in production
            if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
              fetch("/api/monitoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "performance",
                  data: { metric: "LCP", value: entry.startTime },
                }),
              }).catch(console.error)
            }
          }
        }
      }).observe({ entryTypes: ["largest-contentful-paint"] })

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            console.log("[v0] FID:", (entry as any).processingStart - entry.startTime)

            if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
              fetch("/api/monitoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "performance",
                  data: { metric: "FID", value: (entry as any).processingStart - entry.startTime },
                }),
              }).catch(console.error)
            }
          }
        }
      }).observe({ entryTypes: ["first-input"] })

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }

        if (clsValue > 0) {
          console.log("[v0] CLS:", clsValue)

          if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
            fetch("/api/monitoring", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "performance",
                data: { metric: "CLS", value: clsValue },
              }),
            }).catch(console.error)
          }
        }
      }).observe({ entryTypes: ["layout-shift"] })
    }
  }, [])

  return null
}
