import { type NextRequest } from "next/server";
import { searchOfferItems } from "@/features/offers/api/searchOfferItems";
import { apiSuccess, apiError } from "@/shared/lib/api-response";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ offerId: string }> }
) {
    const { offerId } = await params;
    const { searchParams } = req.nextUrl;

    const query = searchParams.get("query") ?? "";
    const offset = Number(searchParams.get("offset") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "50");
    const moduleId = searchParams.get("module_id") ?? "3";

    try {
        const data = await searchOfferItems(offerId, query, offset, limit, moduleId);
        return apiSuccess(data);
    } catch {
        return apiError("Offer search failed", 500);
    }
}
