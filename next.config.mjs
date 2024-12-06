/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
    PORT: process.env.NEXT_PUBLIC_PORT,
    MONGODB_URL: process.env.NEXT_PUBLIC_MONGODB_URI,
    KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  },
};

export default nextConfig;
