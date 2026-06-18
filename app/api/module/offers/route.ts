
import {
    GetOffersResponse,
} from "@/features/module/types/offers.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const module_id = searchParams.get("module_id");
    if (!module_id || Number.isNaN(Number(module_id))) {
        return apiError("Module ID is required", 400);
    }
    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v1/offers/active`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                zoneId: ZONE_ID!,
                moduleId: module_id,
            },
            next: { revalidate: Number(REVALIDATE_TIME) }
        });
        if (!backendRes.ok) {
            return apiError("Failed to get offers", backendRes.status);
        }
        const data: GetOffersResponse = await backendRes.json();
        return apiSuccess<GetOffersResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to get offers", 500);
    }
}
