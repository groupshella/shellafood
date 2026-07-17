import type { NextRequest } from "next/server";

import { getLoyaltyTransactionsPage } from "@/features/profile/api/points";
import { resolveFinancialLang } from "@/features/profile/lib/financial-http";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
    const lang = resolveFinancialLang(request);
    const rawOffset = Number(request.nextUrl.searchParams.get("offset") ?? "0");

    if (
        !Number.isInteger(rawOffset) ||
        rawOffset < 0 ||
        rawOffset % PAGE_SIZE !== 0
    ) {
        return apiError(
            lang === "ar" ? "قيمة الإزاحة غير صالحة" : "Invalid offset",
            400,
        );
    }

    try {
        const page = await getLoyaltyTransactionsPage(
            rawOffset,
            PAGE_SIZE,
            lang,
        );
        return apiSuccess(page);
    } catch (error) {
        return apiError(
            error instanceof Error
                ? error.message
                : lang === "ar"
                    ? "تعذر تحميل تاريخ النقاط"
                    : "Could not load points history",
            502,
        );
    }
}
