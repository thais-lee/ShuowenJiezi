import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.shuowen.org', // Cho phép tải ảnh từ trang này
      },
    ],
  },
};

export default nextConfig;
