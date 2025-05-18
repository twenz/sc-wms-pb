import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  transpilePackages: ['react-big-calendar'],   // library emitting classic JSX
};

export default nextConfig;
