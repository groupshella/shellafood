import { GetPopularBrandsResponse } from "@/features/search/types/popular-brands.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;
const MODULE_ID = process.env.MODULE_ID;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    if (!moduleId || Number.isNaN(Number(moduleId))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v2/brands`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-Localization": "ar",
                moduleId: MODULE_ID!,
            },
            next: { revalidate: Number(REVALIDATE_TIME) },
        });

        if (!backendRes.ok) {
            return apiError("Failed to get popular brands", backendRes.status);
        }

        const body = await backendRes.json();
        const brands: GetPopularBrandsResponse = Array.isArray(body) ? body : (body.data ?? []);
        return apiSuccess<GetPopularBrandsResponse>(brands, backendRes.status);
    } catch {
        return apiError("Failed to get popular brands", 500);
    }
}
