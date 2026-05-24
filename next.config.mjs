/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cache-Control", value: "no-store" }
        ]
      },
      {
        source: "/:path*\\.(jpg|jpeg|png|webp|gif)",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Content-Disposition", value: "inline" },
          { key: "X-Robots-Tag", value: "noimageindex, noarchive" }
        ]
      }
    ];
  }
};

export default nextConfig;
