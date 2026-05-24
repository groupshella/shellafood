import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { DepartmentPage } from '@/features/categories';
import { DepartmentResponse } from '@/features/categories/types/department.types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBaseUrl } from '@/features/auth/constants/auth.constants';

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

  const categoryName = "المتاجر";
  const storeName = "المتجر ";
  const departmentName = "القسم ";

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

  const limit = 20;
  const page = Math.max(1, Number(search.page) || 1);
  const zoneId = 2; // zone_id


  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/department-details?storeId=${storeId}&departmentId=${departmentId}&moduleId=${moduleId}&limit=${limit}&offset=${page}&zoneId=${zoneId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },

  });
  const data = await response.json();

  return <DepartmentPage departmentResponse={data as DepartmentResponse} storeId={storeId} departmentId={departmentId} initialPage={page} initialLimit={limit} moduleId={moduleId} zoneId={zoneId} />


}
