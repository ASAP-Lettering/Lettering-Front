import withPlugins from 'next-compose-plugins';
import withPWA from 'next-pwa';
import typescript from 'next-plugin-graphql';

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

export default withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: 'public',
          register: true,
          skipWaiting: true
        }
      }
    ],
    [
      typescript,
      {
        typescriptLoaderOptions: {
          transpileOnly: false
        }
      }
    ]
  ],
  nextConfig
);
