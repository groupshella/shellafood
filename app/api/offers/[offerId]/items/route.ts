import { type NextRequest } from "next/server";
import { getOfferItems } from "@/features/offers/api/getOfferItems";
import { apiSuccess, apiError } from "@/shared/lib/api-response";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ offerId: string }> }
) {
    const { offerId } = await params;
    const { searchParams } = req.nextUrl;

    const offset = Number(searchParams.get("offset") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "50");
    const moduleId = searchParams.get("module_id") ?? "3";
    const langParam = searchParams.get("lang");
    const lang = langParam === "en" || langParam === "ar" ? langParam : "ar";

    try {
        const data = await getOfferItems(offerId, offset, limit, moduleId, lang, true);
        return apiSuccess(data);
    } catch {
        return apiError("Offer items failed", 500);
    }
}
