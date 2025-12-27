import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

/**
 * API Route Proxy for Zone Data
 * 
 * This route acts as a proxy between the frontend and the external API.
 * Benefits:
 * - Hides API endpoint from client
 * - Allows server-side caching
 * - Works reliably in Vercel/serverless environments
 * - Can add authentication/rate limiting if needed
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const lang = searchParams.get('lang') || DEFAULT_LANG;

  // Validate required parameters
  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: 'Missing required parameters: latitude and longitude are required' },
      { status: 400 }
    );
  }

  // Validate latitude and longitude are valid numbers
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    return NextResponse.json(
      { error: 'Invalid coordinates: latitude and longitude must be valid numbers' },
      { status: 400 }
    );
  }

  // Validate coordinate ranges
  if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    return NextResponse.json(
      { error: 'Invalid coordinate ranges: latitude must be between -90 and 90, longitude between -180 and 180' },
      { status: 400 }
    );
  }

  try {
    // Use BASE_URL if available, otherwise fallback to hardcoded production URL
    const apiBaseUrl = BASE_URL && BASE_URL !== 'undefined' && BASE_URL !== 'http://localhost:8000'
      ? BASE_URL
      : 'https://shellafood.com';
    
    const url = `https://shellafood.com/api/v1/config/get-zone-id?latitude=${latitude}&longitude=${longitude}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Proxy] Fetching from external API:', url);
    }
    
    // Create AbortController for timeout (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-localization': lang,
          'User-Agent': 'ShellaFood-WebApp/1.0',
        },
        signal: controller.signal,
        // Don't cache the external API call - we'll handle caching in the response
        cache: 'no-store',
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[Proxy] External API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200), // Limit log size
        });
        
        return NextResponse.json(
          { 
            error: 'External API request failed',
            status: response.status,
            details: errorText.substring(0, 200),
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data.zone_id === 'undefined') {
        console.error('[Proxy] Invalid response structure from external API:', data);
        return NextResponse.json(
          { error: 'Invalid response structure from external API' },
          { status: 502 }
        );
      }
      
      // Return successful response with caching headers
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('[Proxy] Request timeout after 10 seconds');
        return NextResponse.json(
          { error: 'Request timeout - external API took too long to respond' },
          { status: 504 }
        );
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('[Proxy] Unexpected error:', {
      message: error?.message || 'Unknown error',
      name: error?.name,
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}