import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shellafood.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('[Forgot Password API] Request received:', {
      phone: body.phone,
    });

    const backendRes = await fetch(`https://shellafood.com/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-localization': body.lang || 'ar',
        'Host': 'shellafood.com',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email_or_phone: body.email_or_phone,
        field_type: body.field_type
      }),
    });

    console.log('[Forgot Password API] Backend response status:', backendRes.status);

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error('[Forgot Password API] Backend error:', data);
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || data.error || 'Failed to send password reset link' 
        },
        { status: backendRes.status }
      );
    }

    console.log('[Forgot Password API] Password reset link sent successfully');

    return NextResponse.json({
      success: true,
      message: data.message || 'Password reset link has been sent to your phone number',
      data: data.data || {},
    });
  } catch (error) {
    console.error('[Forgot Password API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

