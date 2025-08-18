import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { safeMetadataBase } from "@/lib/utils/metadata"

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

const baseUrl = safeMetadataBase(process.env.NEXT_PUBLIC_BASE_URL).toString()

export const metadata: Metadata = {
  title: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
  description:
    "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Emporium. Your premier destination for luxury lifestyle products.",
  generator: "v0.app",
  keywords:
    "luxury, real estate, wines, cars, hair, wigs, perfumes, premium, exclusive, fashion, beauty, jewelry, lifestyle",
  authors: [{ name: "ABL NATASHA EMPORIUM" }],
  creator: "ABL NATASHA EMPORIUM",
  publisher: "ABL NATASHA EMPORIUM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: safeMetadataBase(process.env.NEXT_PUBLIC_BASE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
    description:
      "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Emporium.",
    url: "/",
    siteName: "ABL NATASHA EMPORIUM",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABL NATASHA EMPORIUM - Luxury Lifestyle Collection",
    description:
      "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances.",
    images: ["/og-image.jpg"],
    creator: "@ablnatasha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-verification-code",
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ABL NATASHA EMPORIUM",
              url: baseUrl,
              logo: `${baseUrl}/og-image.jpg`,
              description:
                "Luxury lifestyle collection featuring real estate, wines, cars, hair products, and fragrances.",
              sameAs: [
                "https://facebook.com/ablnatasha",
                "https://instagram.com/ablnatasha",
                "https://twitter.com/ablnatasha",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "English",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "NG",
              },
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//vercel.live" />
        <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
      </head>
      <body className="font-sans bg-luxury-cream text-luxury-navy min-h-screen">
        <Suspense fallback={null}>
          <CartProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </CartProvider>
        </Suspense>
      </body>
    </html>
  )
}
