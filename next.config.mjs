/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a production build run alongside `next dev` without sharing `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
};

export default nextConfig;
