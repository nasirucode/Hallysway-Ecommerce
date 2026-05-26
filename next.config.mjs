/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.hallysway.com" },
      { protocol: "https", hostname: "admin.hallysway.com" },
      { protocol: "https", hostname: "hallysway.com" },
      { protocol: "https", hostname: "www.hallysway.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"]
  }
};

export default nextConfig;
