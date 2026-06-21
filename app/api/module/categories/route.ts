
import {
    BackendCategoriesResponse,
    GetCategoriesResponse,
} from "@/features/markets/types/categories.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const module_id = searchParams.get("module_id");
    const latitude = searchParams.get("latitude") ?? LATITUDE!;
    const longitude = searchParams.get("longitude") ?? LONGITUDE!;

    if (!module_id || Number.isNaN(Number(module_id))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v2/categories`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-localization": "ar",
                "Accept-Language": "ar",
                moduleId: module_id,
                zoneId: ZONE_ID!,
                latitude,
                longitude,
            },
            next: { revalidate: Number(REVALIDATE_TIME) },
        });

        if (!backendRes.ok) {
            return apiError("Failed to get categories", backendRes.status);
        }

        const json: BackendCategoriesResponse = await backendRes.json();
        const categories: GetCategoriesResponse = json.data ?? [];
        return apiSuccess<GetCategoriesResponse>(categories, backendRes.status);
    } catch {
        return apiError("Failed to get categories", 500);
    }
}
