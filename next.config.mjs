/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Keep the MongoDB driver as a normal Node dependency (not bundled).
    serverComponentsExternalPackages: ["mongodb"],
  },
};

export default nextConfig;
