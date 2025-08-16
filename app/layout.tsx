import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from 'next/font/google'
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { MainHeader } from "@/components/layout/main-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Footer } from "@/components/layout/footer"

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
  openGraph: {
    title: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
    description: "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Emporium.",
    type: "website",
    locale: "en_US",
    siteName: "ABL Natasha Emporium",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
    description: "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Emporium.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#0d4f3c" />
      </head>
      <body className="font-sans bg-luxury-cream text-luxury-emerald min-h-screen">
        <CartProvider>
          <MainHeader />
          <main className="pb-20 lg:pb-0">
            {children}
          </main>
          <MobileBottomNav />
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
