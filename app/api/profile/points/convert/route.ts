import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess, extractBackendError } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

function resolveLang(req: Request): "ar" | "en" {
	const header =
		req.headers.get("lang") ??
		req.headers.get("Accept-Language") ??
		req.headers.get("X-localization") ??
		"";
	return header.toLowerCase().startsWith("en") ? "en" : "ar";
}

function authHeaders(token: string, lang: "ar" | "en"): HeadersInit {
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json; charset=UTF-8",
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
		moduleId: MODULE_ID,
		zoneId: ZONE_ID,
	};
}

/**
 * POST /api/v1/customer/loyalty-point/point-transfer
 * Body: { point: number }
 */
export async function POST(req: Request) {
	const lang = resolveLang(req);
	const isArabic = lang === "ar";
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
	if (!token) return apiError("Unauthorized", 401);
	if (!BACKEND_URL) return apiError("API URL not configured", 500);

	let body: { point?: number; points?: number };
	try {
		body = await req.json();
	} catch {
		return apiError("Invalid request body", 400);
	}

	const point = Number(body.point ?? body.points ?? 0);
	if (!Number.isFinite(point) || point <= 0) {
		return apiError(
			isArabic
				? "يجب تحديد عدد النقاط المراد تحويلها"
				: "Please specify how many points to convert",
			400,
		);
	}

	try {
		const res = await fetch(
			`${BACKEND_URL}/api/v1/customer/loyalty-point/point-transfer`,
			{
				method: "POST",
				headers: authHeaders(token, lang),
				body: JSON.stringify({ point }),
			},
		);

		const json = await res.json();
		if (!res.ok) {
			return apiError(
				extractBackendError(
					json,
					isArabic ? "فشل في تحويل النقاط" : "Failed to convert points",
				),
				res.status,
			);
		}

		return apiSuccess(json?.data ?? json);
	} catch {
		return apiError(
			isArabic
				? "فشل في تحويل النقاط إلى المحفظة"
				: "Failed to convert points to wallet",
			502,
		);
	}
}
