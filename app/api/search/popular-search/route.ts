import { GetPopularSearchResponse } from "@/features/search/types/popular-search.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;
const DEFAULT_MODULE_ID = process.env.MODULE_ID ?? "3";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const module_id = searchParams.get("module_id") ?? DEFAULT_MODULE_ID;

    if (Number.isNaN(Number(module_id))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v2/search/popular?limit=10`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-Localization": "ar",
                moduleId: module_id,
            },
            next: { revalidate: Number(REVALIDATE_TIME) },
        });

        if (!backendRes.ok) {
            return apiError("Failed to get popular search", backendRes.status);
        }

        const body = await backendRes.json();
        const items: GetPopularSearchResponse = Array.isArray(body) ? body : (body.data ?? []);
        return apiSuccess<GetPopularSearchResponse>(items, backendRes.status);
    } catch {
        return apiError("Failed to get popular search", 500);
    }
}
