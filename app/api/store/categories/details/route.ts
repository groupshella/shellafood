import { StoreCategory } from "@/features/store/types/store-categories.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";

    if (!id || Number.isNaN(Number(id))) {
        return apiError("Store ID is required", 400);
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v2/stores/${id}/categories`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Accept-Language": "ar",
                "X-Localization": "ar",
                zoneId: ZONE_ID!,
            },
            next: { revalidate: Number(REVALIDATE_TIME) },
        });

        if (!backendRes.ok) {
            return apiError("Failed to get store details", backendRes.status);
        }

        const data = (await backendRes.json()) as StoreCategory[];
        return apiSuccess<StoreCategory[]>(data, backendRes.status);
    } catch {
        return apiError("Failed to get store details", 500);
    }
}
