import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { ANALYTICS_ENDPOINTS } from "@/features/profile/constants/statistics.constants";
import { adaptProducts } from "@/features/profile/lib/statistics-adapters";
import type { StatisticsProduct } from "@/features/profile/types/statistics.types";
import {
	apiError,
	apiSuccess,
	extractBackendError,
} from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE ?? "24.7136";
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE ?? "46.6753";

function resolveLang(req: NextRequest): "ar" | "en" {
	const header =
		req.headers.get("lang") ??
		req.headers.get("Accept-Language") ??
		req.headers.get("X-localization") ??
		"";
	return header.toLowerCase().startsWith("en") ? "en" : "ar";
}

export async function GET(req: NextRequest) {
	const lang = resolveLang(req);
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	if (!token) return apiError("Unauthorized", 401);

	const period = req.nextUrl.searchParams.get("period") ?? "month";
	const limit = req.nextUrl.searchParams.get("limit") ?? "10";

	try {
		const url = new URL(
			`${BACKEND_URL}${ANALYTICS_ENDPOINTS.mostPurchasedProducts}`,
		);
		url.searchParams.set("period", period);
		url.searchParams.set("limit", limit);

		const res = await fetch(url.toString(), {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json; charset=UTF-8",
				Authorization: `Bearer ${token}`,
				"Accept-Language": lang,
				"X-localization": lang,
				lang,
				moduleId: MODULE_ID,
				zoneId: ZONE_ID,
				latitude: LATITUDE,
				longitude: LONGITUDE,
			},
			cache: "no-store",
		});

		const json = await res.json();
		if (!res.ok) {
			return apiError(
				extractBackendError(json, "Failed to load most purchased products"),
				res.status,
			);
		}

		return apiSuccess<StatisticsProduct[]>(adaptProducts(json?.data ?? json));
	} catch {
		return apiError("Failed to load most purchased products", 502);
	}
}
