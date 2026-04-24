import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  experimental: {
    // Ensures only used GSAP/Lenis exports are bundled — critical for tree-shaking
    optimizePackageImports: ['gsap', 'lenis'],
  },
  images: {
    // Allow AVIF + WebP — best compression for Awwwards-level performance
    formats: ['image/avif', 'image/webp'],
    // Required in Next.js 16: allowlist quality values
    qualities: [75, 85, 90],
    // Longer cache TTL for remote images (31 days)
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
