import { StorePage } from '@/features/categories';
import { getCachedStoreDetails } from '@/features/categories/api/stores.api';
import { Metadata } from 'next';
import { StoreDetails } from '@/features/categories/types/store.details.types';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{
    category: string;
    store: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

/* =========================
   Metadata
========================= */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { category, store } = await params;

  const categoryName = "المتاجر";
  const storeName = "المتجر ";

  return {
    title: `${storeName} - ${categoryName} | شلة فود`,
    description: `تصفح الأقسام والمنتجات في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
    keywords: [
      storeName,
      categoryName,
      'متجر',
      'أقسام',
      'منتجات',
      'تسوق',
      'شلة فود',
    ],
    openGraph: {
      title: `${storeName} - ${categoryName} | شلة فود`,
      description: `تصفح الأقسام والمنتجات في ${storeName}.`,
      type: 'website',
      url: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}`,
      siteName: 'شلة فود',
      locale: 'ar_SA',
      images: [
        {
          url: '/og-categories.jpg',
          width: 1200,
          height: 630,
          alt: `${storeName} - ${categoryName}`,
        },
      ],
    },
    alternates: {
      canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}`,
    },
    metadataBase: new URL("https://shellafood.com"),
  };
}

/* =========================
   Page Route
========================= */
export default async function StorePageRoute(
  { params, searchParams }: PageProps
) {
  const cookie = await cookies();
  const { category, store } = await params;
  const search = await searchParams;

  const storeId = Number(store);
  const moduleId = Number(category);

  // ✅ Validate IDs
  if (
    isNaN(storeId) || storeId <= 0 ||
    isNaN(moduleId) || moduleId <= 0
  ) {
    notFound();
  }

  const limit = 20;
  const offset = Math.max(1, Number(search.page) || 1);
  const zoneId = 2; // TODO: replace with real zone resolver
  
  // Get user location from cookie
  const userLocationCookie = cookie.get('user_location')?.value;
  const userLocation = userLocationCookie ? userLocationCookie.split(',') : null;
  const longitude = userLocation?.[0] || '';
  const latitude = userLocation?.[1] || '';
  
  // ✅ Fetch store details (cached)
  const storeDetailsResponse = await getCachedStoreDetails(
    limit,
    offset,
    DEFAULT_LANG,
    moduleId,
    zoneId,
    storeId,
    longitude,
    latitude
  );

  if (!storeDetailsResponse?.data) {
    notFound();
  }

  // ✅ Success
  return (
    <StorePage
      store={storeDetailsResponse.data as StoreDetails}
      initialLimit={limit}
      initialPage={offset}
    />
  );
}
