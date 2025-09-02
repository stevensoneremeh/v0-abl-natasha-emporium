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
  serverExternalPackages: ["@supabase/supabase-js", "@supabase/realtime-js"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@supabase/realtime-js")
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    return config
  },
}

module.exports = nextConfig
