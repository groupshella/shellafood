import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { Coupon } from "@/features/coupons/types/coupon.types";

/**
 * GET /api/v1/coupon/list/all
 * Powers شاشة قسائمي (both tabs). Splitting into "available" / "expired"
 * happens client-side via `features/coupons/lib/coupon-utils.ts` — the API
 * has no `status=expired` filter, only `expire_date`.
 */
export async function getCoupons(lang: "ar" | "en"): Promise<Coupon[]> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	if (!token) {
		// Coupons require an authenticated user — return empty rather than
		// throwing so guests just see the empty state.
		return [];
	}

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupon/list/all?_t=${Date.now()}`,
		{
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
				moduleId: process.env.MODULE_ID ?? "",
				zoneId: process.env.ZONE_ID ?? "[1]",
				"Accept-Language": lang,
				"X-localization": lang,
				lang,
				"Cache-Control": "no-cache",
				Pragma: "no-cache",
			},
			// Coupon usability (is_used/expire) changes often — don't cache.
			cache: "no-store",
			next: { tags: ["coupons", `coupons-${lang}`] },
		}
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch coupons: ${res.status}`);
	}

	const json = await res.json();

	// API returns either a bare array or one wrapped in data/coupons/items.
	if (Array.isArray(json)) return json;
	return json.data ?? json.coupons ?? json.items ?? [];
}
