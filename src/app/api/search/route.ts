import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/features/categories/api/search.api';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const name = searchParams.get('name') || '';
	const limit = Number(searchParams.get('limit')) || 20;
	const offset = Number(searchParams.get('offset')) || 1;
	const locale = searchParams.get('locale') || DEFAULT_LANG;
	const moduleId = Number(searchParams.get('moduleId'));
	const zoneId = Number(searchParams.get('zoneId')) || 2;

	if (!name || name.trim() === '') {
		return NextResponse.json({ error: 'Search name is required' }, { status: 400 });
	}

	if (!moduleId || isNaN(moduleId) || moduleId <= 0) {
		return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
	}

	try {
		const searchResponse = await searchProducts(
			name,
			limit,
			offset,
			locale,
			moduleId,
			zoneId
		);

		if (!searchResponse?.data) {
			return NextResponse.json(
				{ error: searchResponse?.error || 'Failed to search products' },
				{ status: searchResponse?.status || 500 }
			);
		}

		return NextResponse.json(searchResponse.data, {
			headers: {
				'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
				'CDN-Cache-Control': 'max-age=600',
			},
		});
	} catch (error) {
		console.error('Search API Route Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

