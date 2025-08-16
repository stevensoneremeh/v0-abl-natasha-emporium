"use client"

import type React from "react"

import { PageTransition } from "@/components/animations/page-transition"

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
