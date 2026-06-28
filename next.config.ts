import type { NextConfig } from "next";
import path from "path";

const imageHostnames = [
  "lh3.googleusercontent.com",
  "googleusercontent.com",
  "avatars.githubusercontent.com",
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
      port: "",
      pathname: "/**",
    })),
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
