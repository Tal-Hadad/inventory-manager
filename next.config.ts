import type { NextConfig } from "next";

const imageHostnames = [
  "lh3.googleusercontent.com",
  "googleusercontent.com",
  "avatars.githubusercontent.com",
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
