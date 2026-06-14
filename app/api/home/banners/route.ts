// /api/home/banners
import {
    GetBannersResponse,
} from "@/features/home/types/banners.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME; // 1 hour
export async function GET() {
    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v1/banners?featured=1`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                zoneId: ZONE_ID!,
            },
            next: { revalidate: Number(REVALIDATE_TIME) }
        });
        if (!backendRes.ok) {
            return apiError("Failed to get banners", backendRes.status);
        }
        const data: GetBannersResponse = await backendRes.json();
        return apiSuccess<GetBannersResponse>(data, backendRes.status);
    } catch (error) {
        return apiError("Failed to get banners", 500);
    }
}
