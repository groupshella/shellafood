import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const locale = request.headers.get('x-localization') || searchParams.get('locale') || DEFAULT_LANG;
	const zoneId = searchParams.get('zoneId') || '2';

	try {
		// Get auth token from cookies
		const cookieStore = await cookies();
		const authToken = cookieStore.get('auth_token')?.value;

		if (!authToken) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const url = `https://shellafood.com/api/v1/customer/notifications`;

		console.log('[Notifications API Route] Fetching notifications:', {
			locale,
			zoneId,
			url,
		});

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Host': 'shellafood.com',
				'X-localization': locale,
				'Authorization': `Bearer ${authToken}`,
				'zoneId': "[2]",
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('[Notifications API Route] Error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorText,
			});

			return NextResponse.json(
				{
					error: `Failed to fetch notifications: ${response.statusText}`,
					details: errorText
				},
				{ status: response.status }
			);
		}

		const data = await response.json();

		console.log('[Notifications API Route] Success:', {
			notificationsCount: Array.isArray(data) ? data.length : data?.notifications?.length ?? 0,
		});

		return NextResponse.json(data);
	} catch (error: any) {
		console.error('[Notifications API Route] Caught error:', {
			message: error?.message,
			stack: error?.stack,
			name: error?.name,
		});
		return NextResponse.json(
			{ error: 'Internal server error', details: error?.message },
			{ status: 500 }
		);
	}
}

