import { NextRequest, NextResponse } from 'next/server';
import { getCachedProductDetails } from '@/features/categories/api/products.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const productId = Number(searchParams.get('productId'));
  const moduleId = Number(searchParams.get('moduleId'));
  const zoneId = Number(searchParams.get('zoneId')) || 2;
  const locale = searchParams.get('locale') || DEFAULT_LANG;

  // Validate params
  if (!productId || isNaN(productId) || !moduleId || isNaN(moduleId)) {
    return NextResponse.json(
      { error: 'Invalid product ID or module ID' },
      { status: 400 }
    );
  }

  try {
    const productResponse = await getCachedProductDetails(
      moduleId,
      productId,
      zoneId,
      locale
    );

    if (!productResponse?.data) {
      return NextResponse.json(
        { error: productResponse?.error || 'Failed to fetch product details' },
        { status: productResponse?.status || 500 }
      );
    }

    // ✅ Return with cache headers
    return NextResponse.json(productResponse.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=600',
      },
    });
  } catch (error) {
    console.error('Product Details API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

