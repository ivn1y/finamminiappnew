/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [],
  },
  // Development optimizations
  compress: false,
  poweredByHeader: false,
  generateEtags: false,
  // Build optimizations (swcMinify is default in Next.js 15)
  experimental: {
    // optimizeCss: true,
  },
  // Development server settings
  devIndicators: {
    position: 'bottom-right',
  },
  // Mobile development settings
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
