import CategoryView from '@/features/categories/components/category-details/CategoryView';
import { Metadata } from 'next';
import { getCachedAllStores } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ 
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);

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
  

  const limit = 30; // Between 12-48
  const offset =Math.max(1, Number(search.page) || 1);
  
  
  const storeListResponse = await getCachedAllStores(
    limit,
    offset,
    DEFAULT_LANG,
    moduleId,
    2 // zone_id
  );

  if (!storeListResponse?.data) {
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
      initialStoreList={storeListResponse.data}
      moduleId={moduleId}
      initialPage={offset}
      initialLimit={limit}
    />
  );
}