import { StorePage } from '@/features/categories';
import { getCachedStoreDetails } from '@/features/categories/api/stores.api';
import { Metadata } from 'next';
import { StoreDetails } from '@/features/categories/types/store.details.types';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { notFound } from 'next/navigation';

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

  const categoryName = decodeURIComponent(category);
  const storeName = decodeURIComponent(store);

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
  };
}

/* =========================
   Page Route
========================= */
export default async function StorePageRoute(
  { params, searchParams }: PageProps
) {
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

  const limit = 30;
  const offset = Math.max(1, Number(search.page) || 1);

  const zoneId = 2; // TODO: replace  with real zone resolver

  // ✅ Fetch store details (cached)
  const storeDetailsResponse = await getCachedStoreDetails(
    limit,
    offset,
    DEFAULT_LANG,
    moduleId,
    zoneId,
    storeId
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
