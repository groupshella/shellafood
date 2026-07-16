import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type {
	CheckoutStoreSummary,
	StoreSummaryApiData,
	StoreSummaryApiResponse,
} from "@/features/checkout/types/store-summary.types";

function toNumber(value: string | number | null | undefined, fallback = 0): number {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return fallback;
}

/** Strict truthy for API flags (avoids Boolean("false") === true). */
function toBool(value: unknown): boolean {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value === 1;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		return normalized === "1" || normalized === "true";
	}
	return false;
}

function normalizeStoreSummary(data: StoreSummaryApiData): CheckoutStoreSummary {
	return {
		id: data.id,
		name: data.name,
		address: data.address,
		latitude: toNumber(data.latitude),
		longitude: toNumber(data.longitude),
		logo: data.logo,
		avgRating: toNumber(data.avg_rating),
		ratingCount: toNumber(data.rating_count),
		open: toBool(data.open),
		zoneId: data.zone_id,
		taxPercent: toNumber(data.tax, 15),
		minimumOrder: toNumber(data.minimum_order),
		freeDelivery: toBool(data.free_delivery),
		minimumShippingCharge: toNumber(data.minimum_shipping_charge),
		maximumShippingCharge: toNumber(data.maximum_shipping_charge),
		perKmShippingCharge: toNumber(data.per_km_shipping_charge),
		firstKmFee: toNumber(data.first_km_fee),
		firstKmDistance: toNumber(data.first_km_distance),
		extraPackagingStatus: toBool(data.extra_packaging_status),
		extraPackagingAmount: toNumber(data.extra_packaging_amount),
		cutlery: toBool(data.cutlery),
	};
}

/**
 * Fetches checkout store summary for shipping rules + store location.
 * GET /api/v2/checkout/store-summary?store_id=
 */
export async function getCheckoutStoreSummary(
	storeId: number,
	lang: "ar" | "en",
): Promise<CheckoutStoreSummary | null> {
	if (!storeId) return null;

	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	const headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json; charset=UTF-8",
		zoneId: process.env.ZONE_ID ?? "[2]",
		moduleId: process.env.MODULE_ID ?? "3",
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	try {
		const url = new URL(
			`${process.env.NEXT_PUBLIC_API_URL}/api/v2/checkout/store-summary`,
		);
		url.searchParams.set("store_id", String(storeId));

		const res = await fetch(url.toString(), {
			headers,
			cache: "no-store",
		});

		if (!res.ok) return null;

		const json = (await res.json()) as StoreSummaryApiResponse;
		if (!json?.status || !json.data) return null;

		return normalizeStoreSummary(json.data);
	} catch {
		return null;
	}
}
