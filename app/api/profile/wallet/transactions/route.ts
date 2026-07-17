import { type NextRequest } from "next/server";

import {
	getWalletTransactions,
	isWalletHistoryFilter,
} from "@/features/profile/api/wallet";
import { resolveFinancialLang } from "@/features/profile/lib/financial-http";
import {
	isValidWalletPagination,
	WALLET_TRANSACTION_PAGE_SIZE,
} from "@/features/profile/lib/wallet-validation";
import type { WalletHistoryFilter } from "@/features/profile/types/wallet.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

/**
 * BFF for wallet history filters.
 * Proxies to GET /api/v1/customer/wallet/transactions?offset&limit&type
 */
export async function GET(req: NextRequest) {
	const lang = resolveFinancialLang(req);
	const isArabic = lang === "ar";
	const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
	const limit = Number(
		req.nextUrl.searchParams.get("limit") ?? WALLET_TRANSACTION_PAGE_SIZE,
	);
	const typeParam = req.nextUrl.searchParams.get("type") ?? "all";

	if (!isValidWalletPagination(offset, limit)) {
		return apiError(
			isArabic ? "قيم ترقيم سجل المحفظة غير صالحة" : "Invalid wallet pagination",
			400,
		);
	}

	if (!isWalletHistoryFilter(typeParam)) {
		return apiError(
			isArabic ? "نوع معاملة المحفظة غير صالح" : "Invalid wallet transaction type",
			400,
		);
	}

	const type: WalletHistoryFilter = typeParam;

	try {
		const groups = await getWalletTransactions(
			offset,
			limit,
			type,
			lang,
			true,
		);
		return apiSuccess(groups);
	} catch {
		return apiError(
			isArabic
				? "فشل في جلب معاملات المحفظة"
				: "Failed to fetch wallet transactions",
			502,
		);
	}
}
