
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1760519392670.cluster-gjstlrnqpna56vr4xhdezmmq4e.cloudworkstations.dev',
    ],
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/tonconnect-manifest.json',
        destination: '/api/tonconnect-manifest',
      },
    ];
  },
};

export default nextConfig;
