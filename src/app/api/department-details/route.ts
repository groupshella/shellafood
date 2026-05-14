import { NextRequest, NextResponse } from 'next/server';

import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { DepartmentResponse } from '@/features/categories/types/department.types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const storeId = Number(searchParams.get('storeId'));
  const departmentId = Number(searchParams.get('departmentId'));
  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 1;
  const locale = searchParams.get('locale') || DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;
  console.log("zoneId", zoneId);
  console.log("moduleId", moduleId);
  console.log("storeId", storeId);
  console.log("departmentId", departmentId);
  console.log("limit", limit);
  console.log("offset", offset);
  console.log("locale", locale);


  // ✅ صح
  const url = `https://shellafood.com/api/v1/categories/items/${departmentId}?store_id=${storeId}&limit=${limit}&offset=${offset}`;
  try {



    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Localization': "ar",
        'moduleId': moduleId.toString(),
        'zoneId': "[2]",
        'longitude': "46.5444937",
        'latitude': "24.567752",
        // Remove 'Host' header
      },
      cache: 'no-store',
    });

    // Add this before response.json()
    if (!response.ok) {
      const raw = await response.text();
      console.error('Backend returned non-OK:', response.status, raw.slice(0, 500));
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const raw = await response.text();
      console.error('Backend returned non-JSON:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Backend returned non-JSON response' },
        { status: 502 }
      );
    }

    const data = await response.json() as DepartmentResponse;

    return NextResponse.json(data, {
      status: 200,
    });

  } catch (error) {
    console.error('Department Details API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }


}

