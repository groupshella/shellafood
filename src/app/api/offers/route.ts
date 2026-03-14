import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LANG = 'ar';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zoneId = searchParams.get('zoneId');
  const moduleId = searchParams.get('moduleId');
  const lang = searchParams.get('lang') || DEFAULT_LANG;

 

  try {
    
    const url = `https://shellafood.com/api/v1/offers/active`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.  abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-localization': lang,
        'Host': 'shellafood.com',
        "zoneId": `[${zoneId?.toString()}]` || '[2]',
        "moduleId": moduleId?.toString() || '3',
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