import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - ABL NATASHA ENTERPRISES",
  description: "Get in touch with ABL NATASHA ENTERPRISES. We're here to help with your luxury shopping needs.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
