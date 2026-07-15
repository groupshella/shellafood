import { type NextRequest } from "next/server";

import {
    getWalletTransactions,
    isWalletHistoryFilter,
} from "@/features/profile/api/wallet";
import type { WalletHistoryFilter } from "@/features/profile/types/wallet.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

/**
 * BFF for wallet history filters.
 * Proxies to GET /api/v1/customer/wallet/transactions?offset&limit&type
 */
export async function GET(req: NextRequest) {
    const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 10);
    const typeParam = req.nextUrl.searchParams.get("type") ?? "all";

    if (!isWalletHistoryFilter(typeParam)) {
        return apiError("Invalid wallet transaction type", 400);
    }

    const type: WalletHistoryFilter = typeParam;

    try {
        const groups = await getWalletTransactions(
            Number.isFinite(offset) ? offset : 0,
            Number.isFinite(limit) ? limit : 10,
            type,
        );
        return apiSuccess(groups);
    } catch {
        return apiError("فشل في جلب معاملات المحفظة", 502);
    }
}
