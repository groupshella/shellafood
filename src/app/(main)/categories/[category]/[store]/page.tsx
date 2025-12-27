import { StorePage } from '@/features/categories';
import { Metadata } from 'next';
import { StoreDetails } from '@/features/categories/types/store.details.types';
import { notFound } from 'next/navigation';
import { getBaseUrl } from '@/features/auth/constants/auth.constants';
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
  
  // ✅ Use API route as proxy
  try {
    const cookieStore = await cookies();
    // Format cookies as header string
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/store-details?storeId=${storeId}&moduleId=${moduleId}&limit=${limit}&offset=${offset}&zoneId=${zoneId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(cookieHeader && { 'Cookie': cookieHeader }), // Forward cookies for location
      },
      // ✅ Next.js built-in cache
      next: {
        revalidate: 3600, // Re-fetch every 5 minutes
        tags: [`store-details-${storeId}-${moduleId}-${zoneId}`],
      },
    });
    
    if (!response.ok) {
      console.error('[Store Page] API route error:', response.status);
      notFound();
    }
    
    const storeDetails = await response.json() as StoreDetails;
    
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
