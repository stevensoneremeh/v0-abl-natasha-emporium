import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Us - ABL NATASHA ENTERPRISES",
  description:
    "Learn about ABL NATASHA ENTERPRISES - your premier destination for luxury fashion, beauty, real estate, and exclusive services.",
}

export default function AboutPage() {
  return <AboutPageClient />
}
