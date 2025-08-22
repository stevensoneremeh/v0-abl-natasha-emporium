import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Us - ABL NATASHA EMPORIUM",
  description:
    "Learn about ABL NATASHA EMPORIUM - your premier destination for luxury fashion, beauty, real estate, and exclusive services.",
}

export default function AboutPage() {
  return <AboutPageClient />
}
