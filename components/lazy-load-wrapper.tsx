"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface LazyLoadWrapperProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  fallback?: React.ReactNode
}

export function LazyLoadWrapper({
  children,
  className,
  threshold = 0.1,
  rootMargin = "50px",
  fallback = null,
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}
