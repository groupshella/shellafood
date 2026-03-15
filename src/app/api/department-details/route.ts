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



   // ✅ صح
const url = `https://shellafood.com/api/v1/categories/items/${departmentId}?store_id=${storeId}&limit=${limit}&offset=${offset}`;
    try {
    
    
    
      const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Localization': "ar",
        'moduleId': moduleId.toString(),
        'zoneId': "[2,3,4,5]",
       'longitude': "46.5995713",
        'latitude': "24.6100271",
        'Host': 'shellafood.com',
      },
      cache: 'no-store',
      });
    
  
    
      const data = await response.json() as DepartmentResponse;
    
  console.log("data", data);
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
  
