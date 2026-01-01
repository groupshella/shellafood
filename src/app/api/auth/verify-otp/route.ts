import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LANG, STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lang = body.lang || DEFAULT_LANG;
const cookieStore = await cookies()
const guest_id = cookieStore.get('guest_id')?.value || '';
    // Call external API
    const externalApiUrl = `https://shellafood.com/api/v1/auth/login`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Host': 'shellafood.com',
      'X-localization': lang,
    };
    const externalResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        login_type: 'otp',
        phone: body.phone,
        otp: body.otp,
        verified: true,
        guest_id: guest_id,
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
    const token = data.token;
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

