import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.myshopify.com',   // product images hosted on your shop
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',    // Shopify CDN
      },
      {
        protocol: 'https',
        hostname: 'shopifycdn.net',     // extra Shopify CDN (sometimes used)
      },
    ],
  },
};

export default nextConfig;
