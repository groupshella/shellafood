import { type NextRequest } from "next/server";

import { getWalletBonuses } from "@/features/profile/api/wallet";
import { resolveFinancialLang } from "@/features/profile/lib/financial-http";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

export async function GET(req: NextRequest) {
	const lang = resolveFinancialLang(req);
	try {
		return apiSuccess(await getWalletBonuses(lang, true));
	} catch {
		return apiError(
			lang === "ar" ? "فشل في جلب مكافآت المحفظة" : "Failed to load wallet bonuses",
			502,
		);
	}
}
