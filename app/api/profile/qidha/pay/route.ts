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

export async function POST(req: Request) {
	const lang = resolveLang(req);
	const isArabic = lang === "ar";
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
	if (!token) return apiError("Unauthorized", 401);

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return apiError("Invalid request body", 400);
	}

	try {
		const res = await fetch(`${BACKEND_URL}/api/qidha-wallet/debit`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				"Accept-Language": lang,
				"X-localization": lang,
				lang,
				moduleId: MODULE_ID,
				zoneId: ZONE_ID,
			},
			body: JSON.stringify(body),
		});

		const json = await res.json();
		if (!res.ok) {
			return apiError(
				extractBackendError(
					json,
					isArabic ? "فشلت عملية الدفع" : "Payment failed",
				),
				res.status,
			);
		}
		return apiSuccess(json?.data ?? json);
	} catch {
		return apiError(isArabic ? "فشلت عملية الدفع" : "Payment failed", 502);
	}
}
