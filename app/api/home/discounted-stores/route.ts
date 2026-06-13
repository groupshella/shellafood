import { GetDiscountedStoresResponse } from "@/features/home/types/discounted-stores.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const MODULE_ID = process.env.MODULE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET() {
    try {
        const backendRes = await fetch(
            `${BACKEND_URL}/api/v2/stores/discounted?limit=12&offset=0`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Localization": "ar",
                    zoneId: ZONE_ID!,
                    moduleId: MODULE_ID!,
                    latitude: LATITUDE!,
                    longitude: LONGITUDE!,
                },
                next: { revalidate: Number(REVALIDATE_TIME) },
            },
        );

        if (!backendRes.ok) {
            return apiError(`Backend error: ${backendRes.status}`, backendRes.status);
        }

        const data: GetDiscountedStoresResponse = await backendRes.json();
        return apiSuccess<GetDiscountedStoresResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to get discounted stores", 500);
    }
}
