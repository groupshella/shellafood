import { NextRequest, NextResponse } from 'next/server';
import { getModuleCategories } from '@/features/(modules)/modules/api/modules.api';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const moduleId = searchParams.get('moduleId')?.trim();
	if (!moduleId)
		return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
	const zoneId = searchParams.get('zoneId') ?? '[2]';
	const locale = searchParams.get('locale') ?? searchParams.get('lang') ?? 'ar';
	const latitude = searchParams.get('latitude') ?? searchParams.get('lat') ?? '24.7136';
	const longitude = searchParams.get('longitude') ?? searchParams.get('lng') ?? '46.6753';
	try {
		const data = await getModuleCategories(moduleId, zoneId, locale, latitude, longitude);
		if (!data) {
			return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
		}
		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
			},
		});
	} catch (err) {
		return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
	}
}