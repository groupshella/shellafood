import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LANG } from "@/features/(actors)/auth/constants/auth.constants";

const DEFAULT_LAT = "24.7136";
const DEFAULT_LNG = "46.6753";

/** Proxies Laravel `GET .../categories/stores/{categoryId}` */
export async function GET(
	req: NextRequest,
) {

	const { searchParams } = new URL(req.url);

	const categoryId = searchParams.get("categoryId")?.trim();
	if (!categoryId || isNaN(Number(categoryId)) || Number(categoryId) <= 0) {
		return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
	}

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

	const forward = new URLSearchParams(searchParams);
	for (const key of [
		"categoryId",
		"moduleId",
		"zoneId",
		"latitude",
		"longitude",
		"lat",
		"lng",
		"locale",
		"lang",
	]) {
		forward.delete(key);
	}

	const limit = forward.get("limit") ?? "10";
	const offset = forward.get("offset") ?? "1";
	forward.set("limit", limit);
	forward.set("offset", offset);

	const targetUrl = `https://shellafood.com/api/v1/categories/stores/${categoryId}?${forward.toString()}`;

	try {
		const response = await fetch(targetUrl, {
			method: "GET",
			headers,
			cache: "no-store",
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			return NextResponse.json(err, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, {
			headers: {
				"Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
			},
		});
	} catch (err) {
		console.error("[api/category-stores]", err);
		return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
	}
}
