import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    const rawLat = body.latitude ?? body.lat;
    const rawLng = body.longitude ?? body.lng;
    const lat = typeof rawLat === 'number' ? rawLat : parseFloat(String(rawLat ?? ''));
    const lng = typeof rawLng === 'number' ? rawLng : parseFloat(String(rawLng ?? ''));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude are required' },
        { status: 400 },
      );
    }

    const moduleIdFromBody = body.moduleId ?? body.module_id;
    const moduleIdHeader =
      moduleIdFromBody !== undefined && moduleIdFromBody !== null && String(moduleIdFromBody).trim() !== ''
        ? String(moduleIdFromBody)
        : '3';

    const payload = {
      ...body,
      latitude: lat,
      longitude: lng,
    };

    const url = `https://shellafood.com/api/v1/customer/address/add`;

    console.log('[Addresses API Route] Adding address:', {
      url,
      locale,
      hasCoords: true,
    });
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-localization': locale,
        'Authorization': `Bearer ${authToken}`,
        'Host': 'shellafood.com',
        'moduleId': moduleIdHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Addresses API Route] Add Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      let parsed: { errors?: Array<{ code?: string; message?: string }>; message?: string } | undefined;
      try {
        parsed = JSON.parse(errorText) as {
          errors?: Array<{ code?: string; message?: string }>;
          message?: string;
        };
      } catch {
        parsed = undefined;
      }
      const firstError = parsed?.errors?.[0]?.message;
      const message =
        firstError || parsed?.message || `Failed to add address: ${response.statusText}`;

      return NextResponse.json(
        {
          error: message,
          errors: parsed?.errors,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    console.log('[Addresses API Route] Add Success');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Addresses API Route] Caught error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

