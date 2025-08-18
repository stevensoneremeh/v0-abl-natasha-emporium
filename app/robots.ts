import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://abl-natasha-emporium.vercel.app"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout/success", "/checkout/cancel"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
