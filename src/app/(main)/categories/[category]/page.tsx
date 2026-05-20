import CategoryView from '@/features/categories/components/category-details/CategoryView';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEFAULT_LANG, getBaseUrl } from '@/features/auth/constants/auth.constants';
import type { ApiCategory } from '@/features/categories/types/api-category.types';
import type { StoreList } from '@/features/categories/types/store.types';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    moduleName?: string;
  }>;
}

const EMPTY_STORE_LIST = (limit: number, offset: number): StoreList => ({
  stores: [],
  total_size: 0,
  limit,
  offset,
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = "المتاجر";

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
  if (isNaN(moduleId) || moduleId <= 0) {
    return notFound();
  }

  const limit = 20;
  const offset = Math.max(1, Number(search.page) || 1);
  const baseUrl = getBaseUrl();
  const cookieStore = await cookies();
  const userLocation = cookieStore.get('user_location');

  const latitude = userLocation?.value.split(',')[0] || '24.567752';
  const longitude = userLocation?.value.split(',')[1] || '46.5444937';

  const storeParams = new URLSearchParams({
    moduleId: String(moduleId),
    limit: String(limit),
    offset: String(offset),
    zoneId: "2",
    latitude: latitude,
    longitude: longitude,
  });

  const categoriesParams = new URLSearchParams({
    moduleId: String(moduleId),
    zoneId: "[2]",
    locale: 'ar',
    "X-Localization": "ar",
    'Accept-Language': 'ar',
  });

  try {
    const [storesRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/stores?${storeParams}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/modules/categories?${categoriesParams}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
    ]);

    let storeListData: StoreList = EMPTY_STORE_LIST(limit, offset);
    let categories: ApiCategory[] = [];

    if (storesRes.ok) {
      const data = await storesRes.json();
      if (data?.stores && Array.isArray(data.stores)) {
        storeListData = data;
      }
    } else {
      console.error("[Category Page] Stores API error:", storesRes.status);
    }

    if (categoriesRes.ok) {
      const catData = await categoriesRes.json();
      categories = Array.isArray(catData?.categories) ? catData.categories : [];
    } else {
      console.error("[Category Page] modules/categories API error:", categoriesRes.status);
    }

    return (
      <CategoryView
        initialStoreList={storeListData}
        initialCategories={categories}
        moduleId={moduleId}
        initialPage={offset}
        initialLimit={limit}
      />
    );
  } catch (error: unknown) {
    console.error("[Category Page] Error:", error);
    return (
      <CategoryView
        initialStoreList={EMPTY_STORE_LIST(limit, offset)}
        initialCategories={[]}
        moduleId={moduleId}
        initialPage={offset}
        initialLimit={limit}
      />
    );
  }
}
