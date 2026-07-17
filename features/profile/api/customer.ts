import "server-only";

import type { AuthUser } from "@/features/auth/types/auth.types";
import {
	customerHeaders,
	FINANCIAL_API,
	getFinancialToken,
	type FinancialLang,
} from "@/features/profile/lib/financial-http";
import { getProfileUser } from "@/features/profile/lib/get-profile-user";
import { mapCustomerInfoToAuthUser } from "@/features/profile/lib/profile.lib";

export async function getLiveCustomerInfo(
	lang: FinancialLang = "ar",
): Promise<AuthUser | null> {
	const [token, current] = await Promise.all([
		getFinancialToken(),
		getProfileUser(),
	]);
	if (!token || !FINANCIAL_API.baseUrl) return current;

	try {
		const response = await fetch(
			`${FINANCIAL_API.baseUrl}/api/v1/customer/info`,
			{
				headers: customerHeaders(token, lang),
				cache: "no-store",
			},
		);
		if (!response.ok) return current;
		const json: unknown = await response.json();
		if (!json || typeof json !== "object") return current;
		const root = json as Record<string, unknown>;
		const candidate = root.data ?? root.user ?? root;
		if (!candidate || typeof candidate !== "object") return current;
		return mapCustomerInfoToAuthUser(
			candidate as Record<string, unknown>,
			current,
		);
	} catch {
		return current;
	}
}
