import { CategoryDetails } from "@/features/categories/types/category-detail.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId") ?? "";
    const limit = searchParams.get("limit") ?? "20";
    const { id } = await params;

    if (!storeId || Number.isNaN(Number(storeId))) {
        return apiError("Store ID is required", 400);
    }

    if (!id) {
        return apiError("Category ID is required", 400);
    }

    try {
        const backendRes = await fetch(
            `${BACKEND_URL}/api/v2/stores/${storeId}/categories/${id}?limit=${limit}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Accept-Language": "ar",
                    "X-Localization": "ar",
                    zoneId: ZONE_ID!,
                },
                next: { revalidate: Number(REVALIDATE_TIME) },
            },
        );

        if (!backendRes.ok) {
            return apiError("Failed to get category detail", backendRes.status);
        }

        const data = (await backendRes.json()) as CategoryDetails;
        return apiSuccess<CategoryDetails>(data, backendRes.status);
    } catch {
        return apiError("Failed to get category detail", 500);
    }
}