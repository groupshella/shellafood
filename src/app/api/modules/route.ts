import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LANG = 'ar';
const REQUEST_TIMEOUT = 10_000;

function isValidLatLng(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latRaw = searchParams.get('lat') ?? searchParams.get('latitude');
  const lngRaw = searchParams.get('lng') ?? searchParams.get('longitude');
  const lang = searchParams.get('lang') || DEFAULT_LANG;

  if (!latRaw || !lngRaw) {
    return NextResponse.json(
      { errors: [{ code: 'validation', message: 'lat and lng are required' }] },
      { status: 403 }
    );
  }

  const lat = parseFloat(latRaw);
  const lng = parseFloat(lngRaw);

  if (!isValidLatLng(lat, lng)) {
    return NextResponse.json(
      { errors: [{ code: 'validation', message: 'Invalid coordinates' }] },
      { status: 403 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const url = `https://shellafood.com/api/v1/config/get-zone-id?lat=${lat}&lng=${lng}`;

    // Forward the real browser headers so Cloudflare sees a legitimate browser request
    const forwardHeaders: Record<string, string> = {
      Accept: 'application/json',
      'X-localization': lang,
    };

    // Forward key browser headers from the original request
    const headersToForward = [
      'user-agent',
      'accept-language',
      'accept-encoding',
      'cf-connecting-ip',
      'x-forwarded-for',
      'x-real-ip',
    ];
    for (const header of headersToForward) {
      const value = request.headers.get(header);
      if (value) forwardHeaders[header] = value;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: forwardHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 404 = outside zone — return empty success so client can handle gracefully
    if (response.status === 404) {
      return NextResponse.json(
        { zone_id: null, zone_data: [], metadata: { is_in_zone: false } },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`[Zone Proxy] External API error ${response.status}:`, body.slice(0, 200));
      return NextResponse.json(
        { error: 'External API request failed', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    console.error('[Zone Proxy] Error:', error?.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}