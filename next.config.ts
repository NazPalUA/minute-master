import type { NextConfig } from 'next'
import './env.ts'

const nextConfig: NextConfig = {
  experimental: {
    // dynamicIO: true,
    reactCompiler: true,
    ppr: 'incremental'
  }
}

export default nextConfig
