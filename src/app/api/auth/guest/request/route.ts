import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
	try {
		const lang = request.headers.get('X-LANG') || DEFAULT_LANG;

		const externalApiUrl = `https://shellafood.com/api/v1/auth/guest/request`;

		const externalResponse = await fetch(externalApiUrl, {
			method: 'POST',
			headers: {
				'X-LANG': lang,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			},
		});

		const data = await externalResponse.json();

		if (!externalResponse.ok) {
			return NextResponse.json(
				{
					success: false,
					message: data.message || (lang === 'ar' ? 'فشل التسجيل كضيف' : 'Guest registration failed')
				},
				{ status: externalResponse.status }
			);
		}
		// ✅ Set HTTP-only cookie with token


		const response = NextResponse.json(
			{
				success: true,
				message: data.message || (lang === 'ar' ? 'تم التسجيل كضيف بنجاح' : 'Guest registration successful'),
				data: data.data || data
			},
			{ status: externalResponse.status }
		);
		const guest_id = data?.guest_id;
		if (guest_id) {
			response.cookies.set('guest_id', guest_id, {
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
			});
		}
		return response;

	} catch (error: any) {
		console.error('[Guest Request API] Error:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error'
			},
			{ status: 500 }
		);
	}
}

