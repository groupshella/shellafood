import { Metadata } from 'next';
import ProductPage from '@/features/categories/components/product/ProductPage';
import { getCachedProductDetails } from '@/features/categories/api/products.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { Product } from '@/features/categories/types/product.types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    category: string;
    store: string;
    department: string;
    product: string;
  }>;
}

/* ================= METADATA ================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, store, department, product } = await params;

    const categoryName = "المتاجر";
  const storeName = "المتجر ";
  const departmentName = "القسم ";
  const productName = "المنتج ";

  const url = `https://shellafood.com/categories/${category}/${store}/${department}/${product}`;

  return {
    title: `${productName} - ${storeName} | شلة فود`,
    description: `عرض تفاصيل ${productName} من ${departmentName} في ${storeName} ضمن ${categoryName}. أضف إلى السلة واكمل الطلب في شلة فود.`,
    keywords: [
      productName,
      departmentName,
      storeName,
      categoryName,
      'تفاصيل المنتج',
      'تسوق',
      'شلة فود',
    ],
    openGraph: {
      title: `${productName} - ${storeName} | شلة فود`,
      description: `عرض تفاصيل ${productName} من ${departmentName} في ${storeName} ضمن ${categoryName}.`,
      type: 'website',
      url,
      siteName: 'شلة فود',
      locale: 'ar_SA',
      images: [
        {
          url: '/og-categories.jpg',
          width: 1200,
          height: 630,
          alt: `${productName} - ${storeName}`,
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

export default async function ProductPageRoute({ params }: PageProps) {
  const { category, store, department, product } = await params;

  const moduleId = Number(category);
  const storeId = Number(store);
  const departmentId = Number(department);
  const productId = Number(product);

  // ✅ Validation (same pattern)
  if (
    isNaN(moduleId) ||
    isNaN(storeId) ||
    isNaN(departmentId) ||
    isNaN(productId) ||
    moduleId <= 0 ||
    storeId <= 0 ||
    departmentId <= 0 ||
    productId <= 0
  ) {
    notFound();
  }

  const startTime = Date.now();

  const productResponse = await getCachedProductDetails(
    moduleId,
    productId,
    2, // zone_id
    DEFAULT_LANG
  );

  const duration = Date.now() - startTime;

  console.log('[Product Page] Product fetched:', {
    duration: `${duration}ms`,
    moduleId,
    storeId,
    departmentId,
    productId,
    hasProduct: !!productResponse?.data,
    productIdResponse: productResponse?.data?.id || 0,
    productName: productResponse?.data?.name || '',
  });

  // ✅ Safe fallback
  if (!productResponse?.data) {
    notFound();
  }

  return (
    <ProductPage
      productResponse={productResponse.data as Product}
	
    />
  );
}
