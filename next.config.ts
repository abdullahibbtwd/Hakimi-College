import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // Whitelist the specific hostname
        port: '',
        pathname: '/**', // Allow any path on this hostname
      },
    
    ],
  },
};

export default nextConfig;
