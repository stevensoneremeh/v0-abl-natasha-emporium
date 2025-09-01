/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@supabase/realtime-js")
    }
    return config
  },
}

module.exports = nextConfig
