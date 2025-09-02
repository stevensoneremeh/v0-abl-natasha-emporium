/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://abl-natasha-emporium.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/dashboard/*", "/auth/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/auth/", "/api/"],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://abl-natasha-emporium.vercel.app"}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority based on page importance
    const priorities = {
      "/": 1.0,
      "/products": 0.9,
      "/categories": 0.8,
      "/about": 0.7,
      "/contact": 0.6,
    }

    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority: priorities[path] || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
