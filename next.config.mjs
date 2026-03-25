/** @type {import('next').NextConfig} */

// CSP configuration for production
const cspDirectives = [
  "default-src 'self'",
  // Scripts: self + inline for Next.js hydration + eval for development
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org https://*.telegram.org",
  // Styles: self + inline for styled-components/emotion/tailwind
  "style-src 'self' 'unsafe-inline'",
  // Images: self + data URIs + Telegram CDN + blob for dynamic images
  "img-src 'self' data: blob: https://*.telegram.org https://telegram.org",
  // Fonts: self + data URIs
  "font-src 'self' data:",
  // Connect: API endpoints
  "connect-src 'self' https://*.finam.ru https://telegram.org https://*.telegram.org wss://*.finam.ru",
  // Frame sources: Telegram widgets
  "frame-src 'self' https://telegram.org https://*.telegram.org",
  // Prevent embedding in frames (clickjacking protection)
  "frame-ancestors 'none'",
  // Form submissions
  "form-action 'self'",
  // Base URI restriction
  "base-uri 'self'",
  // Upgrade HTTP to HTTPS
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspDirectives,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
];

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
  // Security headers for all environments
  async headers() {
    // Development: CORS headers for local testing
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
    
    // Production: Security headers including CSP
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
