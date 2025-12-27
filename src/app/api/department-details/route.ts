import { NextRequest, NextResponse } from 'next/server';
import { getCachedDepartments } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const storeId = Number(searchParams.get('storeId'));
  const departmentId = Number(searchParams.get('departmentId'));
  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 1;
  const locale = searchParams.get('locale') || DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;

  // Validate params
  if (!storeId || isNaN(storeId) || !departmentId || isNaN(departmentId) || !moduleId || isNaN(moduleId)) {
    return NextResponse.json(
      { error: 'Invalid store ID, department ID, or module ID' },
      { status: 400 }
    );
  }

  try {
    const departmentResponse = await getCachedDepartments(
      limit,
      offset,
      locale,
      moduleId,
      zoneId,
      storeId,
      departmentId
    );

    if (!departmentResponse?.data) {
      return NextResponse.json(
        { error: departmentResponse?.error || 'Failed to fetch department details' },
        { status: departmentResponse?.status || 500 }
      );
    }

    // ✅ Return with cache headers
    return NextResponse.json(departmentResponse.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=600',
      },
    });
  } catch (error) {
    console.error('Department Details API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

