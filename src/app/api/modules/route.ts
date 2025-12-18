import { NextRequest, NextResponse } from 'next/server';
import { getCachedZoneData } from '@/features/categories/api/modules.api';
import { ZoneDataModule } from '@/features/categories/types/module.types';
import { Module } from '@/features/categories/types/module.types';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

// Note: Edge runtime is commented out as it may not support all Node.js APIs
// Uncomment if your deployment supports edge runtime and all dependencies are compatible
// export const runtime = 'edge'; // ✅ Deploy to edge for global low latency

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const latitude = parseFloat(searchParams.get('lat') || '24.7136');
	const longitude = parseFloat(searchParams.get('lng') || '46.6753');
	const locale = searchParams.get('locale') || DEFAULT_LANG;

	try {
		const zoneData = await getCachedZoneData(latitude, longitude, locale);

		if (!zoneData) {
			return NextResponse.json(
				{ error: 'Failed to fetch zone data' },
				{ status: 500 }
			);
		}

		const zoneModules = zoneData.zone_data?.[0]?.modules || [];

		// Convert ZoneDataModule[] to Module[]
		const modules: Module[] = zoneModules.map((zoneModule: ZoneDataModule) => ({
			id: zoneModule.id,
			module_name: zoneModule.module_name,
			module_type: zoneModule.module_type,
			description: zoneModule.description,
			status: zoneModule.status,
			icon: zoneModule.icon,
			icon_full_url: zoneModule.icon_full_url,
			thumbnail: zoneModule.thumbnail,
			thumbnail_full_url: zoneModule.thumbnail_full_url,
			stores_count: zoneModule.stores_count,
			items_count: 0,
			theme_id: zoneModule.theme_id,
			all_zone_service: zoneModule.all_zone_service,
			created_at: zoneModule.created_at,
			updated_at: zoneModule.updated_at,
			zones: [],
			translations: zoneModule.translations,
		}));

		const response = NextResponse.json(modules, {
			headers: {
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
				'CDN-Cache-Control': 'max-age=7200',
			},
		});

		// ✅ Persist zone id in cookie for downstream store requests (7 days)
		if (zoneData.zone_id) {
			response.cookies.set('zone-id', String(zoneData.zone_id), {
				path: '/',
				maxAge: 7 * 24 * 60 * 60, // 7 days
			});
		}

		return response;
	} catch (error) {
		console.error('API Route Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

