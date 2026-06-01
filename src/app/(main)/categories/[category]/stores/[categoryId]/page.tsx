import CategoryStoresView from "@/features/categories/components/category-details/CategoryStoresView";
import { getBaseUrl } from "@/features/(actors)/auth/constants/auth.constants";
import type { ApiCategory } from "@/features/categories/types/api-category.types";
import type { StoreList } from "@/features/categories/types/store.types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string; categoryId: string }>;
  searchParams: Promise<{ page?: string; moduleName?: string }>;
}

const EMPTY_STORE_LIST = (limit: number, offset: number): StoreList => ({
  stores: [],
  total_size: 0,
  limit,
  offset,
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  return {
    title: `متاجر التصنيف | شلة فود`,
    description: `تصفح المتاجر في التصنيف ${categoryId}`,
  };
}

export default async function CategoryStoresPageRoute({ params, searchParams }: PageProps) {
  const { category: moduleSlug, categoryId: categorySlug } = await params;
  const search = await searchParams;

  const moduleId = Number(moduleSlug);
  const categoryId = Number(categorySlug);

  if (isNaN(moduleId) || moduleId <= 0 || isNaN(categoryId) || categoryId <= 0) {
    notFound();
  }

  const limit = 10;
  const offset = Math.max(1, Number(search.page) || 1);
  const baseUrl = getBaseUrl();

  const categoriesParams = new URLSearchParams({
    moduleId: String(moduleId),
    zoneId: "[2]",
  });

  const storesPath = new URLSearchParams({
    categoryId: categoryId.toString(),
    moduleId: moduleId.toString(),
    limit: limit.toString(),
    offset: offset.toString(),
    zoneId: "[2]",
  });


  try {
    const [storesRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/category-stores?${storesPath.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json", "X-Localization": "ar", "Accept-Language": "ar" },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/modules/categories?${categoriesParams}`, {
        method: "GET",
        headers: { Accept: "application/json", "X-Localization": "ar", "Accept-Language": "ar" },
        cache: "no-store",
      }),
    ]);

    let storeListData: StoreList = EMPTY_STORE_LIST(limit, offset);
    let categories: ApiCategory[] = [];
    let category: ApiCategory | null = null;

    if (storesRes.ok) {
      const data = await storesRes.json();
      if (data?.stores && Array.isArray(data.stores)) {
        storeListData = data;
      }
    }

    if (categoriesRes.ok) {
      const catData = await categoriesRes.json();
      categories = Array.isArray(catData?.categories) ? catData.categories : [];
      category = categories.find((c) => c.id === categoryId) ?? null;
    }

    return (
      <CategoryStoresView
        moduleId={moduleId}
        categoryId={categoryId}
        category={category}
        initialStoreList={storeListData}
        initialCategories={categories}
        initialPage={offset}
        initialLimit={limit}
      />
    );
  } catch (error) {
    console.error("[CategoryStores Page]", error);
    return (
      <CategoryStoresView
        moduleId={moduleId}
        categoryId={categoryId}
        category={null}
        initialStoreList={EMPTY_STORE_LIST(limit, offset)}
        initialCategories={[]}
        initialPage={offset}
        initialLimit={limit}
      />
    );
  }
}
