import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';
const API_URL = 'https://shellafood.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call external API
    const externalApiUrl = `https://shellafood.com/api/v1/auth/sign-up`;

    const externalResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        f_name: body.f_name,
        l_name: body.l_name,
        name: body.name,
        phone: body.phone,
        email: body.email || '',
        password: body.password,
        referral_code: body.referral_code || '',
      }),
    });

    const data = await externalResponse.json();
    if (!externalResponse.ok) {
      return NextResponse.json({
        success: false,
        message:
          data.errors[0].code == "email" ? "البريد الإلكتروني مستخدم بالفعل" : data.errors[0].code == "phone" ? "رقم الهاتف مستخدم بالفعل" : data.errors[0].message
      },
        { status: externalResponse.status });
    }
    return NextResponse.json({ success: true, message: data.message || 'Registration successful', data: data }, { status: externalResponse.status });

  } catch (error: any) {
    console.log('[Register API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

