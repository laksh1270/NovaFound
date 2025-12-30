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
    ppr: "incremental",
    after: true,
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
    appIsrStatus: false,
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
