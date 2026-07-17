import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { mapCustomerInfoToAuthUser } from "@/features/profile/lib/profile.lib";

export type FinancialLang = "ar" | "en";

export const FINANCIAL_API = {
	baseUrl: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "",
	moduleId: String(process.env.MODULE_ID ?? "3"),
	zoneId: String(process.env.ZONE_ID ?? "[2]"),
	latitude: String(process.env.NEXT_PUBLIC_LATITUDE ?? "24.7136"),
	longitude: String(process.env.NEXT_PUBLIC_LONGITUDE ?? "46.6753"),
} as const;

export async function getFinancialToken(): Promise<string | null> {
	const store = await cookies();
	return store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

export function resolveFinancialLang(request: NextRequest): FinancialLang {
	const value =
		request.headers.get("lang") ??
		request.headers.get("accept-language") ??
		request.headers.get("x-localization") ??
		"ar";
	return value.toLowerCase().startsWith("en") ? "en" : "ar";
}

interface CustomerHeadersOptions {
	contentType?: boolean;
	accept?: boolean;
	dualModuleZone?: boolean;
	includeGeo?: boolean;
}

export function customerHeaders(
	token: string,
	lang: FinancialLang = "ar",
	options: CustomerHeadersOptions = {},
): HeadersInit {
	const {
		contentType = true,
		accept = true,
		dualModuleZone = false,
		includeGeo = false,
	} = options;
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
		moduleId: FINANCIAL_API.moduleId,
		zoneId: FINANCIAL_API.zoneId,
	};

	if (accept) headers.Accept = "application/json";
	if (contentType) headers["Content-Type"] = "application/json; charset=UTF-8";
	if (dualModuleZone) {
		headers["module-id"] = FINANCIAL_API.moduleId;
		headers["zone-id"] = FINANCIAL_API.zoneId;
	}
	if (includeGeo) {
		headers.latitude = FINANCIAL_API.latitude;
		headers.longitude = FINANCIAL_API.longitude;
	}

	return headers;
}

export async function fetchCustomerInfo(
	token: string,
	current: AuthUser | null,
	lang: FinancialLang = "ar",
): Promise<AuthUser | null> {
	const res = await fetch(`${FINANCIAL_API.baseUrl}/api/v1/customer/info`, {
		headers: customerHeaders(token, lang),
		cache: "no-store",
	});

	if (!res.ok) return null;

	const json = await res.json();
	const data = (json?.data ?? json?.user ?? json) as Record<string, unknown>;
	if (!data || typeof data !== "object") return null;

	return mapCustomerInfoToAuthUser(data, current);
}

export function qidhaStoreHeaders(
	token: string,
	lang: FinancialLang,
): HeadersInit {
	return {
		Authorization: `Bearer ${token}`,
		Accept: "application/json",
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
	};
}

export function nafathHeaders(
	token: string,
	lang: FinancialLang,
): HeadersInit {
	return {
		...customerHeaders(token, lang, {
			dualModuleZone: true,
			includeGeo: true,
		}),
		"Cache-Control": "no-cache",
		Pragma: "no-cache",
		"If-None-Match": "",
	};
}
