// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa");

const nextConfig = {
  pwa: {
    dest: "public",
    sw: "service-worker.js",
    // workbox
    swDest: process.env.NEXT_EXPORT
      ? "service-worker.js"
      : "static/service-worker.js",
    swSrc: "./sw.js"
  },
  async rewrites() {
    return [
      {
        source: "/service-worker.js",
        destination: "/_next/static/service-worker.js"
      }
    ];
  }
};

module.exports = withPWA(nextConfig);
