import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",               // where the SW and precache manifest go
  register: true,               // auto-register service worker
  skipWaiting: true,            // immediately activate new SW
  clientsClaim: true,           // take control of pages
  disable: process.env.NODE_ENV === "development", // disable in dev
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,   // cache all HTTP requests
      handler: "NetworkFirst",
      options: {
        cacheName: "http-cache",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }, // 1 day
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
  },
};

export default withPWA(nextConfig);