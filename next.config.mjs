/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "172.**",
        pathname: "/**",
      },
    ],
  },
  // Development optimizations
  compress: false, // Отключаем сжатие для разработки
  poweredByHeader: false,
  generateEtags: false, // Отключаем ETags для разработки
  // Build optimizations
  swcMinify: true,
  experimental: {
    // optimizeCss: true,
  },
  // Development server settings
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  // Mobile development settings
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
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
  },
};

export default nextConfig;
