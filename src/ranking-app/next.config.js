/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  basePath,
  // Inlined into client bundles (importing next.config in Client Components is unreliable).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
