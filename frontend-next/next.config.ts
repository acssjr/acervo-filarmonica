import { withSerwist } from "@serwist/turbopack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
      },
    ],
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/api/:path*",
        destination: isDev
          ? "http://localhost:8787/api/:path*"
          : (process.env.NEXT_PUBLIC_API_URL ||
              "https://acervo-filarmonica-api.acssjr.workers.dev") +
            "/api/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/library",
        destination: "/acervo",
        permanent: true,
      },
      {
        source: "/library/:path*",
        destination: "/acervo/:path*",
        permanent: true,
      },
      {
        source: "/search",
        destination: "/buscar",
        permanent: true,
      },
      {
        source: "/favorites",
        destination: "/favoritos",
        permanent: true,
      },
      {
        source: "/profile",
        destination: "/perfil",
        permanent: true,
      },
      {
        source: "/genres",
        destination: "/generos",
        permanent: true,
      },
      {
        source: "/composers",
        destination: "/compositores",
        permanent: true,
      },
    ];
  },
};

export default withSerwist(nextConfig);
