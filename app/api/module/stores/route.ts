
import { GetStoresResponse } from "@/features/module/types/stores.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const limit = searchParams.get("limit") ?? "12";
    const offset = searchParams.get("offset") ?? "0";
    const latitude = searchParams.get("latitude") ?? LATITUDE!;
    const longitude = searchParams.get("longitude") ?? LONGITUDE!;

    if (!moduleId || Number.isNaN(Number(moduleId))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendRes = await fetch(
            `${BACKEND_URL}/api/v1/stores/get-stores?limit=${limit}&offset=${offset}`,
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
