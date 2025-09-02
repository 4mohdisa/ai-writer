/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true 
  },
  // Remove custom webpack and experimental configs that might cause issues on Vercel
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

module.exports = nextConfig;
