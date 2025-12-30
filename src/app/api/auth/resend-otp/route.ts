import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lang = body.lang || DEFAULT_LANG;

    // Call external API
    const externalApiUrl = `https://shellafood.com/api/v1/auth/send-otp-again`;
    
    const externalResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-LANG': lang,
        'Accept': 'application/json',
        'Host': 'shellafood.com', // Required for Cloudflare bypass
        'Origin': 'https://shellafood.com',
        'Referer': 'https://shellafood.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        phone: body.phone,
      }),
    });

    const data = await externalResponse.json();

    if (!externalResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to resend OTP' },
        { status: externalResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'OTP sent successfully',
      data: data,
    });

  } catch (error: any) {
    console.error('[Resend OTP API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

