import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: Ignore TypeScript errors too
    ignoreBuildErrors: true,
  },

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
