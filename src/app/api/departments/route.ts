import { NextRequest, NextResponse } from 'next/server';
import { getDepartments } from '@/features/categories/api/departments.api';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const storeId = Number(searchParams.get('storeId'));
	const limit = Number(searchParams.get('limit')) || 20;
	const offset = Number(searchParams.get('offset')) || 1;
	const locale = searchParams.get('locale') || DEFAULT_LANG;
	const moduleId = Number(searchParams.get('moduleId'));
	const zoneId = Number(searchParams.get('zoneId'));

	if (!storeId || Number.isNaN(storeId) || storeId <= 0) {
		return NextResponse.json({ error: 'Invalid store ID' }, { status: 400 });
	}
	if (!moduleId || Number.isNaN(moduleId) || moduleId <= 0) {
		return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
	}
	if (!zoneId || Number.isNaN(zoneId) || zoneId <= 0) {
		return NextResponse.json({ error: 'Invalid zone ID' }, { status: 400 });
	}

	try {
		const departmentsResponse = await getDepartments(
			storeId,
			limit,
			offset,
			locale,
			moduleId,
			zoneId,
		);

		if (!departmentsResponse?.data) {
			return NextResponse.json(
				{
					error: departmentsResponse?.error || 'Failed to fetch departments',
				},
				{ status: departmentsResponse?.status ?? 502 },
			);
		}

		return NextResponse.json(departmentsResponse.data, {
			headers: {
				'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
				'CDN-Cache-Control': 'max-age=1200',
			},
		});
	} catch (error) {
		console.error('Departments API Route Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
