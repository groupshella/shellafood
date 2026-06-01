/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration - Mobile-first
  images: {
    unoptimized: false,
    // Optimize for mobile devices first
    formats: ['image/avif', 'image/webp'],
    // Mobile-first device sizes (smaller sizes first for faster mobile loading)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Smaller image sizes for mobile thumbnails and icons
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images for 60 seconds (good balance for mobile data usage)
    minimumCacheTTL: 60,
    // Image quality levels
    qualities: [60, 75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd2sdbeqrqgwwdu.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "shellafood.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev.shelafood.com",
        pathname: "/**",
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
        hostname: 'portal.jahez.net',
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
  // Optimize production builds
  productionBrowserSourceMaps: false,
}


export default nextConfig

