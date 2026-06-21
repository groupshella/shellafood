import { GetCurrentOffersResponse } from "@/features/home/types/current-offers.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const module_id = searchParams.get("module_id");
    if (!module_id || Number.isNaN(Number(module_id))) {
        return apiError("Module ID is required", 400);
    }
    try {
        const backendRes = await fetch(
            `${BACKEND_URL}/api/v2/stores/offers?limit=10&offset=2`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    zoneId: ZONE_ID!,
                    latitude: LATITUDE!,
                    longitude: LONGITUDE!,
                    moduleId: module_id,
                },
                next: { revalidate: Number(REVALIDATE_TIME) },
            },
        );

        if (!backendRes.ok) {
            return apiError(`Backend error: ${backendRes.status}`, backendRes.status);
        }

        const data: GetCurrentOffersResponse = await backendRes.json();
        return apiSuccess<GetCurrentOffersResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to get current offers", 500);
    }
}
