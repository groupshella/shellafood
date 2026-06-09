
import { GetDiscountedStoresResponse } from "@/features/home/types/discounted-stores.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const MODULE_ID = process.env.MODULE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;
/** Proxies Laravel `GET .../stores/discounted`. */
export async function GET() {
    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v1/stores/discounted`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    zoneId: ZONE_ID!,
                    moduleId: MODULE_ID!,
                    longitude: LONGITUDE!,
                    latitude: LATITUDE!,
                },
                next: { revalidate: Number(REVALIDATE_TIME) }
            },
        );
        if (!backendRes.ok) {
            return apiError("Failed to get discounted stores", backendRes.status);
        }

        const data: GetDiscountedStoresResponse = await backendRes.json();
        return apiSuccess<GetDiscountedStoresResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to get discounted stores", 500);
    }
}
