import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import { Suspense } from "react"
import { safeMetadataBase } from "@/lib/utils/metadata"

let Analytics: any = () => null
try {
  const analyticsModule = require("@vercel/analytics/react")
  Analytics = analyticsModule.Analytics
} catch (error) {
  console.warn("@vercel/analytics package not found, skipping analytics")
}

let ThemeProvider: any = ({ children }: { children: React.ReactNode }) => <>{children}</>
try {
  const nextThemes = require("next-themes")
  ThemeProvider = nextThemes.ThemeProvider
} catch (error) {
  console.warn("next-themes package not found, using fallback provider")
}

let SpeedInsights: any = null
try {
  const speedInsightsModule = require("@vercel/speed-insights/next")
  SpeedInsights = speedInsightsModule.SpeedInsights
} catch (error) {
  console.warn("@vercel/speed-insights package not found, skipping speed insights")
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ABL NATASHA ENTERPRISES - Luxury Lifestyle Collection",
  description:
    "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Enterprises. Your premier destination for luxury lifestyle products.",
  generator: "v0.app",
  keywords:
    "luxury, real estate, wines, cars, hair, wigs, perfumes, premium, exclusive, fashion, beauty, jewelry, lifestyle",
  authors: [{ name: "ABL NATASHA ENTERPRISES" }],
  creator: "ABL NATASHA ENTERPRISES",
  publisher: "ABL NATASHA ENTERPRISES",
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
    title: "ABL NATASHA ENTERPRISES - Luxury Lifestyle Collection",
    description:
      "Discover luxury real estate, premium wines, exotic cars, premium hair products, and exclusive fragrances at ABL Natasha Enterprises.",
    url: "/",
    siteName: "ABL NATASHA ENTERPRISES",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ABL NATASHA ENTERPRISES - Luxury Lifestyle Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABL NATASHA ENTERPRISES - Luxury Lifestyle Collection",
    description: "Discover luxury real estate, premium wines, exotic cars, premium hair products, and fragrances.",
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ABL NATASHA ENTERPRISES",
              url: safeMetadataBase(process.env.NEXT_PUBLIC_BASE_URL).toString(),
              logo: `${safeMetadataBase(process.env.NEXT_PUBLIC_BASE_URL).toString()}/og-image.jpg`,
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
      <body className="font-sans bg-background text-foreground min-h-screen transition-colors duration-300">
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Analytics />
                  {SpeedInsights && <SpeedInsights />}
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
