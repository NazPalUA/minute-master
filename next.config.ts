import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // dynamicIO: true,
    reactCompiler: true,
    ppr: 'incremental'
  }
}

export default nextConfig
