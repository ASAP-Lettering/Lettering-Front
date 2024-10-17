/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["lettering-images.s3.amazonaws.com"],
  },
};

export default nextConfig;
