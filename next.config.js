/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.NODE_ENV === "production"
        ? "https://dashboard.techoptimum.org"
        : "http://localhost:3000",
  },
};

module.exports = nextConfig;
