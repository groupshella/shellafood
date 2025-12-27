import CategoryView from '@/features/categories/components/category-details/CategoryView';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getBaseUrl } from '@/features/auth/constants/auth.constants';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ 
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = "المتاجر"

  return {
    title: `${categoryName} | شلة فود`,
    description: `تصفح المتاجر والأقسام في ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
    keywords: [categoryName, "قسم", "متاجر", "أقسام", "منتجات", "تسوق", "شلة فود"],
    openGraph: {
      title: `${categoryName} | شلة فود`,
      description: `تصفح المتاجر والأقسام في ${categoryName}.`,
      type: "website",
      url: `https://shellafood.com/categories/${encodeURIComponent(category)}`,
      siteName: "شلة فود",
      locale: "ar_SA",
      images: [{ url: "/og-categories.jpg", width: 1200, height: 630, alt: categoryName }],
    },
    alternates: {
      canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}`,
    },
  };
}

export default async function CategoryPageRoute({ params, searchParams }: PageProps) {
  const { category } = await params;
  const search = await searchParams;
  
  const moduleId = Number(category);
  
  if(isNaN(moduleId) || moduleId <= 0) {
    return notFound();
  }
  

  const limit = 20; // Between 12-48
  const offset = Math.max(1, Number(search.page) || 1);
  const zoneId = 2; // zone_id
  
  // ✅ Use API route as proxy
  try {
const baseUrl=getBaseUrl();    
    const url = `${baseUrl}/api/stores?moduleId=${moduleId}&limit=${limit}&offset=${offset}&zoneId=${zoneId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // ✅ Next.js built-in cache
      next: {
        revalidate: 3600, // Re-fetch every 5 minutes
        tags: [`stores-${moduleId}-${zoneId}`],
      },
    });
    
    if (!response.ok) {
      console.error('[Category Page] API route error:', response.status);
      // Return empty store list on error
      return (
        <CategoryView 
          initialStoreList={{
            stores: [],
            total_size: 0,
            limit,
            offset,
          }}
          moduleId={moduleId}
          initialPage={offset}
          initialLimit={limit}
        />
      );
    }
    
    const storeListData = await response.json();
    
    // Validate response structure
    // The API route returns storeListResponse.data directly (which has stores, total_size, limit, offset)
    if (!storeListData || !storeListData.stores || !Array.isArray(storeListData.stores)) {
      console.error('[Category Page] Invalid response structure:', storeListData);
      return (
        <CategoryView 
          initialStoreList={{
            stores: [],
            total_size: 0,
            limit,
            offset,
          }}
          moduleId={moduleId}
          initialPage={offset}
          initialLimit={limit}
        />
      );
    }
    
    return (
      <CategoryView 
        initialStoreList={storeListData}
        moduleId={moduleId}
        initialPage={offset}
        initialLimit={limit}
      />
    );
  } catch (error: any) {
    console.error('[Category Page] Error fetching stores:', {
      message: error?.message || 'Unknown error',
      name: error?.name,
    });
    
    // Return empty store list on error
    return (
      <CategoryView 
        initialStoreList={{
          stores: [],
          total_size: 0,
          limit,
          offset,
        }}
        moduleId={moduleId}
        initialPage={offset}
        initialLimit={limit}
      />
    );
  }
}