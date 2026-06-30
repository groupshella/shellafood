import { SearchItemsResponse } from "@/features/search/types/search.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const DEFAULT_MODULE_ID = process.env.MODULE_ID ?? "3";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.trim();
    const module_id = searchParams.get("module_id") ?? DEFAULT_MODULE_ID;
    const latitude = searchParams.get("latitude") ?? LATITUDE ?? "24.7136";
    const longitude = searchParams.get("longitude") ?? LONGITUDE ?? "46.6753";
    const offset = searchParams.get("offset") ?? "1";
    const limit = searchParams.get("limit") ?? "30";

    if (!name) {
        return apiError("Search query is required", 400);
    }

    if (Number.isNaN(Number(module_id))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendParams = new URLSearchParams({ name, offset, limit });
        const backendRes = await fetch(
            `${BACKEND_URL}/api/v1/items/search?${backendParams}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-localization": "ar",
                    moduleId: module_id,
                    zoneId: ZONE_ID!,
                    latitude,
                    longitude,
                },
                cache: "no-store",
            },
        );

        if (!backendRes.ok) {
            return apiError("Failed to search items", backendRes.status);
        }

        const data: SearchItemsResponse = await backendRes.json();
        return apiSuccess<SearchItemsResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to search items", 500);
    }
}
