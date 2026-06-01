import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getModules } from '@/features/(modules)/modules/api/modules.api';
import { MODULES_CONFIG } from '@/features/(modules)/modules/constants/modules.constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    let lat = searchParams.get('lat');
    let lng = searchParams.get('lng');

    const latitude = lat ? parseFloat(lat) : MODULES_CONFIG.DEFAULT_LAT;
    const longitude = lng ? parseFloat(lng) : MODULES_CONFIG.DEFAULT_LNG;

    const modules = await getModules(latitude, longitude);

    return NextResponse.json({ success: true, data: modules });
  } catch (error: any) {
    console.error('[Modules API Route] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}