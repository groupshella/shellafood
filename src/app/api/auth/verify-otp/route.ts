import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, DEFAULT_LANG, STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lang = body.lang || DEFAULT_LANG;
    const token = body.token; // Token from signup

    // Call external API
    const externalApiUrl = `https://shellafood.com/api/v1/auth/verify-phone`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-LANG': lang,
      'Accept': 'application/json',
    };

    // Add token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const externalResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: body.phone,
        otp: body.otp,
      }),
    });

    const data = await externalResponse.json();

    if (!externalResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'OTP verification failed' },
        { status: externalResponse.status }
      );
    }

    // If verification successful, set the auth cookie
    if (token) {
      const cookieStore = await cookies();
      const days = 7; // Default expiry
      const maxAge = days * 24 * 60 * 60; // Convert to seconds

      cookieStore.set({
        name: STORAGE_KEYS.TOKEN,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
      });

      // Store user data if available
      if (data.user) {
        cookieStore.set({
          name: STORAGE_KEYS.USER,
          value: JSON.stringify(data.user),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge,
          path: '/',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Phone verified successfully',
      data: data,
    });

  } catch (error: any) {
    console.error('[Verify OTP API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

