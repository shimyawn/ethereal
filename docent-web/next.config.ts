import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // 로컬 public/ 이미지 최적화 허용
    unoptimized: false,
  },
}

export default nextConfig
