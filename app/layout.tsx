import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
  description:
    "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Emporium.",
  generator: "v0.app",
  keywords: "luxury, real estate, wines, cars, hair, wigs, perfumes, premium, exclusive",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="font-sans bg-luxury-cream text-luxury-navy min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
