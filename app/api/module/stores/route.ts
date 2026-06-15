import { GetStoresResponse } from "@/features/module/types/stores.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("module_id");
    const limit = searchParams.get("limit") ?? "12";
    const offset = searchParams.get("offset") ?? "0";
    const latitude = searchParams.get("latitude") ?? LATITUDE!;
    const longitude = searchParams.get("longitude") ?? LONGITUDE!;

    const categoryId = searchParams.get("category_id");
    const hasOffer = searchParams.get("has_offer");
    const freeDelivery = searchParams.get("free_delivery");
    const topRated = searchParams.get("top_rated");
    const openNow = searchParams.get("open_now");
    const under30Min = searchParams.get("under_30_min");

    if (!moduleId || Number.isNaN(Number(moduleId))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendParams = new URLSearchParams({ limit, offset, module_id: moduleId });
        if (categoryId) backendParams.set("category_id", categoryId);
        if (hasOffer) backendParams.set("has_offer", hasOffer);
        if (freeDelivery) backendParams.set("free_delivery", freeDelivery);
        if (topRated) backendParams.set("top_rated", topRated);
        if (openNow) backendParams.set("open_now", openNow);
        if (under30Min) backendParams.set("under_30_min", under30Min);

        const backendRes = await fetch(
            `${BACKEND_URL}/api/v2/stores?${backendParams}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Localization": "ar",
                    moduleId,
                    zoneId: ZONE_ID!,
                    latitude,
                    longitude,
                },
                next: { revalidate: Number(REVALIDATE_TIME) },
            },
        );

        if (!backendRes.ok) {
            return apiError("Failed to get stores", backendRes.status);
        }

        const data: GetStoresResponse = await backendRes.json();
        return apiSuccess<GetStoresResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to get stores", 500);
    }
}
