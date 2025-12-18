import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { DepartmentPage } from '@/features/categories';
import { getCachedDepartments } from '@/features/categories/api/stores.api';
import { DepartmentResponse } from '@/features/categories/types/department.types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    category: string;
    store: string;
    department: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

/* ================= METADATA ================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, store, department } = await params;

  const categoryName = decodeURIComponent(category);
  const storeName = decodeURIComponent(store);
  const departmentName = decodeURIComponent(department).replace(/-/g, ' ');

  const url = `https://shellafood.com/categories/${encodeURIComponent(
    category
  )}/${encodeURIComponent(store)}/${encodeURIComponent(department)}`;

  return {
    title: `${departmentName} - ${storeName} | شلة فود`,
    description: `تصفح المنتجات في قسم ${departmentName} في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
    keywords: [
      departmentName,
      storeName,
      categoryName,
      'منتجات',
      'تسوق',
      'شلة فود',
    ],
    openGraph: {
      title: `${departmentName} - ${storeName} | شلة فود`,
      description: `تصفح المنتجات في قسم ${departmentName} في ${storeName} ضمن ${categoryName}.`,
      type: 'website',
      url,
      siteName: 'شلة فود',
      locale: 'ar_SA',
      images: [
        {
          url: '/og-categories.jpg',
          width: 1200,
          height: 630,
          alt: `${departmentName} - ${storeName}`,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL('https://shellafood.com'),
  };
}

/* ================= PAGE ================= */

export default async function DepartmentPageRoute({
  params,
  searchParams,
}: PageProps) {
  const { category, store, department } = await params;
  const search = await searchParams;

  const moduleId = Number(category);
  const storeId = Number(store);
  const departmentId = Number(department);

  // ✅ Validation (same as old pattern)
  if (
    isNaN(moduleId) ||
    isNaN(storeId) ||
    isNaN(departmentId) ||
    moduleId <= 0 ||
    storeId <= 0 ||
    departmentId <= 0
  ) {
    notFound();
  }

  const limit = 12;
  const page = Math.max(1, Number(search.page) || 1);

  const startTime = Date.now();

  const departmentsResponse = await getCachedDepartments(
    limit,
    page,
    DEFAULT_LANG,
    moduleId,
    2, // zone_id
    storeId,
    departmentId
  );

  const duration = Date.now() - startTime;

  console.log('[Department Page] Products fetched:', {
    duration: `${duration}ms`,
    moduleId,
    storeId,
    departmentId,
    page,
    limit,
    totalItems: departmentsResponse?.data?.total_size || 0,
    fetchedItems: departmentsResponse?.data?.items?.length || 0,
  });

  // ✅ Safe fallback (same pattern)
  if (!departmentsResponse?.data) {
    return (
      <DepartmentPage
        departmentResponse={departmentsResponse.data as DepartmentResponse}
        storeId={storeId}
        departmentId={departmentId}
        initialPage={page}
        initialLimit={limit}
      />
    );
  }

  return (
    <DepartmentPage
      departmentResponse={departmentsResponse.data as DepartmentResponse}
      storeId={storeId}
      departmentId={departmentId}
      initialPage={page}
      initialLimit={limit}
    />
  );
}
