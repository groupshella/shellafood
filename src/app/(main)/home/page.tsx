import { cookies } from 'next/headers';
import { getZoneModules } from '@/features/categories/api/modules.api';
import { HomePage } from '@/features/home/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "شلة - منصة التوصيل والخدمات الشاملة | Shella Delivery Platform",
  description:
    "احصل على توصيل سريع وموثوق لجميع احتياجاتك من المطاعم والمتاجر في السعودية. أكثر من 2 مليون طلب، تقييم 4.8 نجوم. انضم إلينا كسائق، شريك، أو عامل.",
  keywords: [
    "شلة",
    "توصيل",
    "طعام",
    "مطاعم",
    "متاجر",
    "السعودية",
    "delivery",
    "food",
    "restaurants",
    "سائق",
    "شريك",
    "عامل",
    "قيدها",
  ],
  authors: [{ name: "Shella Team" }],
  openGraph: {
    title: "شلة - منصة التوصيل الأولى في السعودية",
    description:
      "توصيل سريع من آلاف المطاعم والمتاجر. أكثر من 2 مليون طلب مكتمل، تقييم 4.8 نجوم.",
    url: "https://shella.app",
    siteName: "Shella",
    images: [
      {
        url: "/lanfingpage.jpg",
        width: 1200,
        height: 630,
        alt: "Shella Delivery Platform",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "شلة - منصة التوصيل والخدمات",
    description: "توصيل سريع وموثوق من آلاف المطاعم والمتاجر",
    images: ["/lanfingpage.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shella.app",
    languages: {
      "ar-SA": "https://shella.app",
      "en-US": "https://shella.app/en",
    },
  },
};
// FIX: Updated to coordinates confirmed inside zone 2 polygon
// Old: 24.61, 46.5995 — was right on/outside the northern boundary
// New: 24.567752, 46.5444937 — confirmed working from API test

const DEFAULT_LAT = 24.567752;
const DEFAULT_LNG = 46.5444937;

export default async function HomePageRoute() {
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guest_id")?.value;
  const token = cookieStore.get("token")?.value;


  const locationCookie = cookieStore.get('user_location')?.value;

  let latitude = DEFAULT_LAT;
  let longitude = DEFAULT_LNG;

  if (locationCookie) {
    try {
      const parsed = JSON.parse(locationCookie) as Record<string, unknown>;
      const latRaw = parsed.lat ?? parsed.latitude;
      const lngRaw = parsed.lng ?? parsed.longitude;
      if (latRaw != null && lngRaw != null) {
        const lat = parseFloat(String(latRaw));
        const lng = parseFloat(String(lngRaw));
        if (
          !Number.isNaN(lat) &&
          !Number.isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          latitude = lat;
          longitude = lng;
        }
      }
    } catch {
      // ignore invalid cookie
    }
  }

  const modules = await getZoneModules(latitude, longitude);
  console.log("modules", modules);

  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Shella",
          url: "https://shella.app",
          logo: "https://shella.app/logous.png",
          description:
            "منصة توصيل شاملة للطعام والمنتجات في السعودية",
          address: {
            "@type": "PostalAddress",
            addressCountry: "SA",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "10000",
            bestRating: "5",
            worstRating: "1",
          },
        }),
      }}
    />
    <HomePage modules={modules} guestId={guestId || ''} token={token || ''} />
  </>
}