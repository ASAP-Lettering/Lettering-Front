import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['lettering-images.s3.amazonaws.com']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default withPWA({
  dest: 'public'
})(nextConfig);
