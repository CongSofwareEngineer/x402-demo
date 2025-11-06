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
}

export default nextConfig
