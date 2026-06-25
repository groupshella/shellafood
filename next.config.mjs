import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    // Mobile-first device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Smaller image sizes for thumbnails and icons
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 60 seconds
    minimumCacheTTL: 60,
    qualities: [60, 75, 80, 85, 90],

    // ✅ ADDED: explicitly allow all local public/ subfolders
    localPatterns: [
      { pathname: '/home/**' },
      { pathname: '/hyper-market/**' },
      { pathname: '/**' }, // catches any other public/ assets
    ],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hybrisproduction.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'portal.jahez.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'alsadhanimages.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploads-prod.tryblend.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1c124wpoew66.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd2sdbeqrqgwwdu.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shellafood.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev.shelafood.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vecteezy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.deliveryhero.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.hubspot.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnprod.mafretailproxy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mafrservices.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.todoorstep.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'framestrapimaster.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mrmandoob.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hungerstation.dhmedia.io',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;