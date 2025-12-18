import { NextRequest, NextResponse } from 'next/server';
import { getCachedDepartments } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const departmentId = Number(searchParams.get('departmentId'));
  const storeId = Number(searchParams.get('storeId'));
  const moduleId = Number(searchParams.get('moduleId')) || 3;
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 0;
  const locale = DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;

  // Validate params
  if (!departmentId || isNaN(departmentId) || !storeId || isNaN(storeId)) {
    return NextResponse.json(
      { error: 'Invalid department ID or store ID' },
      { status: 400 }
    );
  }

  try {
    const departmentsResponse = await getCachedDepartments(
      limit,
      offset,
      locale,
      moduleId,
      zoneId,
      storeId,
      departmentId
    );

    if (!departmentsResponse?.data) {
      return NextResponse.json(
        { error: 'Failed to fetch department products' },
        { status: 500 }
      );
    }

    // ✅ Return with cache headers
    return NextResponse.json(departmentsResponse.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=600',
      },
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

