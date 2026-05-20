import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";


const DEFAULT_LAT = "24.7136";
const DEFAULT_LNG = "46.6753";

/** Proxies Laravel `GET .../categories` for a module (zone + module headers). */
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const moduleId = searchParams.get("moduleId")?.trim();
	if (!moduleId) {
		return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
	}

	const zoneId = searchParams.get("zoneId") ?? "[2]";



	const locale = searchParams.get("locale") ?? searchParams.get("lang") ?? DEFAULT_LANG;
	const latitude =
		searchParams.get("latitude") ?? searchParams.get("lat") ?? DEFAULT_LAT;
	const longitude =
		searchParams.get("longitude") ?? searchParams.get("lng") ?? DEFAULT_LNG;

	const headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
		zoneId,
		moduleId,
		latitude: String(latitude),
		longitude: String(longitude),
		"X-localization": locale,
		"Accept-Language": locale,
	};

	try {
		const response = await fetch(`https://shellafood.com/api/v1/categories`, {
			method: "GET",
			headers,
			cache: "no-store",
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			return NextResponse.json(err, { status: response.status });
		}

		const data = await response.json();
		const categories = Array.isArray(data) ? data : data.categories ?? data.data ?? [];
		console.log("categories", categories);
		return NextResponse.json(
			{ categories },
			{
				headers: {
					"Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
				},
			},
		);
	} catch (err) {
		console.log("error", err);
		return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
	}
}
