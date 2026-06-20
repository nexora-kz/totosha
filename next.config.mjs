/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/:path*\\.(jpg|jpeg|png|webp|gif)',
        headers: [
          { key: 'Cache-Control', value: 'private, max-age=3600, must-revalidate' },
          { key: 'Content-Disposition', value: 'inline' },
          { key: 'X-Robots-Tag', value: 'noimageindex, noarchive' },
        ],
      },
    ];
  },
};

export default nextConfig;
