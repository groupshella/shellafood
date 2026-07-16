import { GetPopularBrandsResponse } from "@/features/search/types/popular-brands.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const module_id = searchParams.get("module_id");
    const langParam = searchParams.get("lang");
    const lang = langParam === "en" || langParam === "ar" ? langParam : "ar";

    if (!module_id || Number.isNaN(Number(module_id))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v2/brands`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-Localization": lang,
                "Accept-Language": lang,
                lang,
                moduleId: module_id,
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
