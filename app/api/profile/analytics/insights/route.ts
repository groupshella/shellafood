import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { ANALYTICS_ENDPOINTS } from "@/features/profile/constants/statistics.constants";
import { adaptInsights } from "@/features/profile/lib/statistics-adapters";
import type { AnalyticsInsight } from "@/features/profile/types/statistics.types";
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

export async function GET(req: NextRequest) {
	const lang = resolveLang(req);
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	if (!token) return apiError("Unauthorized", 401);

	try {
		const res = await fetch(`${BACKEND_URL}${ANALYTICS_ENDPOINTS.insights}`, {
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
				extractBackendError(json, "Failed to load analytics insights"),
				res.status,
			);
		}

		return apiSuccess<AnalyticsInsight[]>(adaptInsights(json?.data ?? json));
	} catch {
		return apiError("Failed to load analytics insights", 502);
	}
}
