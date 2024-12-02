/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
    PORT: process.env.NEXT_PUBLIC_PORT,
    MONGODB_URL: process.env.NEXT_PUBLIC_MONGODB_URI,
  },
};

export default nextConfig;
