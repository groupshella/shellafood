
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shellafood.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('[Login API] Request received:', {
      email_or_phone: body.email_or_phone,
      field_type: body.field_type,
    });

    const backendRes = await fetch(`https://shellafood.com/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'shellafood.com', // Required for Cloudflare bypass
        'Origin': 'https://shellafood.com',
        'Referer': 'https://shellafood.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        login_type: body.login_type || 'manual',
        email_or_phone: body.email_or_phone,
        field_type: body.field_type || 'phone',
        password: body.password,
        guest_id: body.guest_id || '',
      }),
    });

    console.log('[Login API] Backend response status:', backendRes.status);

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error('[Login API] Backend error:', data);
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Login failed' 
        },
        { status: backendRes.status }
      );
    }

    console.log('[Login API] Login successful');

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: data.data?.user || data.user,
      },
    });

    // ✅ Set HTTP-only cookie with token
    const token = data.token || data.data?.token;
    if (token) {
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: body.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days if remember, else 7 days
      });
    }

    return response;
  } catch (error) {
    console.error('[Login API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}