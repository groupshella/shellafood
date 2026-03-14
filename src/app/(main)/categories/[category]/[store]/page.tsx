import { StorePage } from '@/features/categories';
import { Metadata } from 'next';
import { StoreDetails } from '@/features/categories/types/store.details.types';
import { notFound } from 'next/navigation';
import { getCachedStoreDetails } from '@/features/categories/api/stores.api';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

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
  
  // ✅ Use cached function that calls API route
  try {
    const cookieStore = await cookies();
    const userLocation = cookieStore.get('user_location');
    
    const longitude = userLocation?.value.split(',')[0] || '46.5995713';
    const latitude = userLocation?.value.split(',')[1] || '24.6100271';
    
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
      console.error('[Store Page] Failed to fetch store:', {
        error: storeDetailsResponse?.error,
        status: storeDetailsResponse?.status,
        storeId,
        moduleId,
      });
      notFound();
    }
    
    const storeDetails = storeDetailsResponse.data;
    console.log('storeDetails', storeDetails);
    
    // Validate response structure
    if (!storeDetails || !storeDetails.id) {
      console.error('[Store Page] Invalid response structure:', storeDetails);
      notFound();
    }

  
    
    // ✅ Success
    return (
      <StorePage
        store={storeDetails}
        initialLimit={limit}
        initialPage={offset}
        moduleId={moduleId.toString()}
      />
    );
  } catch (error: any) {
    console.error('[Store Page] Error fetching store details:', {
      message: error?.message || 'Unknown error',
      name: error?.name,
    });
    
    notFound();
  }
}
