import type { NextConfig } from "next";

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // disables PWA in development mode, useful for debugging without service worker interference
  register: true, // registers the service worker for you. Set to false if you want to handle registration manually
  skipWaiting: true, // forces the new service worker to activate immediately upon update
});

const nextConfig: NextConfig = {
};

export default withPWA(nextConfig);
