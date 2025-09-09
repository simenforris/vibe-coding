import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'runescape.wiki',
      },
    ],
  },
};

export default nextConfig;
