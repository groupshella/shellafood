import { Metadata } from 'next';
import ProductPage from '@/features/categories/components/product/ProductPage';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { notFound } from 'next/navigation';
import { getCachedProductDetails } from '@/features/categories/api/products.api';

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

  const zoneId = 2; // zone_id

  // ✅ Use cached function that calls API route
  try {
    const productResponse = await getCachedProductDetails(
      moduleId,
      storeId,
      departmentId,
      productId,
      zoneId,
      DEFAULT_LANG
    );

    if (!productResponse?.data) {
      console.error('[Product Page] Failed to fetch product:', {
        error: productResponse?.error,
        status: productResponse?.status,
        moduleId,
        productId,
      });
      notFound();
    }

    const productData = productResponse.data;

    console.log('[Product Page] Product fetched:', {
      moduleId,
      storeId,
      departmentId,
      productId,
      hasProduct: !!productData?.id,
      productIdResponse: productData?.id || 0,
      productName: productData?.name || '',
    });

    // Validate response structure
    if (!productData || !productData.id) {
      console.error('[Product Page] Invalid response structure:', productData);
      notFound();
    }
    console.log('productData', productData);

    return (
      <ProductPage productResponse={productData} departmentId={departmentId} />
    );
  } catch (error: any) {
    console.error('[Product Page] Error fetching product details:', {
      message: error?.message || 'Unknown error',
      name: error?.name,
    });

    notFound();
  }
}
