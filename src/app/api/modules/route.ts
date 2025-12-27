import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LANG = 'ar';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const lang = searchParams.get('lang') || DEFAULT_LANG;

 

  try {
    const url = `https://shellafood.com/api/v1/config/get-zone-id?latitude=${latitude}&longitude=${longitude}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.  abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-localization': lang,
        'User-Agent': 'ShellaFood-WebApp/1.0',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'External API request failed',
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data || typeof data.zone_id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid response from external API' },
        { status: 502 }
      );
    }
    
      return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }
    
    console.error('[Proxy] Error:', error?.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}