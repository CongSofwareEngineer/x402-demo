import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['x402-next', '@coinbase/onchainkit', '@coinbase/x402'],
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: {
      ssr: true,
      minify: true,
    },
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/demo',
        permanent: true, // Set to true if you want a 308 permanent redirect
      },
    ]
  },
}

export default nextConfig
