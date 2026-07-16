import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { ANALYTICS_ENDPOINTS } from "@/features/profile/constants/statistics.constants";
import { adaptTrends } from "@/features/profile/lib/statistics-adapters";
import type {
	ChartPeriod,
	SpendingTrend,
} from "@/features/profile/types/statistics.types";
import {
	apiError,
	apiSuccess,
	extractBackendError,
} from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

function resolveLang(req: NextRequest): "ar" | "en" {
	const header =
		req.headers.get("lang") ??
		req.headers.get("Accept-Language") ??
		req.headers.get("X-localization") ??
		"";
	return header.toLowerCase().startsWith("en") ? "en" : "ar";
}

export async function GET(request: NextRequest) {
	const lang = resolveLang(request);
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	if (!token) return apiError("Unauthorized", 401);

	const periodParam = request.nextUrl.searchParams.get("period");
	const period: ChartPeriod = periodParam === "month" ? "month" : "week";

	try {
		const url = new URL(`${BACKEND_URL}${ANALYTICS_ENDPOINTS.spendingTrends}`);
		url.searchParams.set("period", period);

		const res = await fetch(url.toString(), {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
				"Accept-Language": lang,
				"X-localization": lang,
				lang,
				moduleId: MODULE_ID,
				zoneId: ZONE_ID,
			},
			cache: "no-store",
		});

		const json = await res.json();
		if (!res.ok) {
			return apiError(
				extractBackendError(json, "Failed to load spending trends"),
				res.status,
			);
		}

		return apiSuccess<SpendingTrend>(adaptTrends(json?.data ?? json, period));
	} catch {
		return apiError("Failed to load spending trends", 502);
	}
}
