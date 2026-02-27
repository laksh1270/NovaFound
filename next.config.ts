import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "*" },
    ],
  },
  experimental: {
    cacheComponents: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

};

export default withSentryConfig(nextConfig, {
  org: "snipcode-p1",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,

  // ❌ REMOVE THIS (this was breaking Sentry)
  // tunnelRoute: "/monitoring",

  disableLogger: true,
  automaticVercelMonitors: true,
});
