import { ItemDetails } from "@/features/item/types/item.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;
const MODULE_ID = process.env.MODULE_ID;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";
    // const moduleId = searchParams.get("module_id") ?? MODULE_ID;
    const moduleId = MODULE_ID;
    if (!id || Number.isNaN(Number(id))) {
        return apiError("Item ID is required", 400);
    }
    if (!moduleId || Number.isNaN(Number(moduleId))) {
        return apiError("Module ID is required", 400);
    }
    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v1/items/details/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Accept-Language": "ar",
                "X-Localization": "ar",
                zoneId: ZONE_ID!,
                moduleId: moduleId,
            },
            next: { revalidate: Number(REVALIDATE_TIME) },
        });

        if (!backendRes.ok) {
            return apiError("Failed to get item details", backendRes.status);
        }

        const data = (await backendRes.json()) as ItemDetails;
        return apiSuccess<ItemDetails>(data, backendRes.status);
    } catch {
        return apiError("Failed to get item details", 500);
    }
}
