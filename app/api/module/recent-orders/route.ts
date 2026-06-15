import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import {
    GetRecentOrdersResponse,
} from "@/features/home/types/recent-orders.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_TIME = Number(process.env.REVALIDATE_TIME);
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("module_id");
    if (!moduleId || Number.isNaN(Number(moduleId))) {
        return apiError("Module ID is required", 400);
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!token) {
        return apiError("Unauthorized", 401);
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/v1/customer/order/recent`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                moduleId: moduleId,
            },
            next: {
                revalidate: REVALIDATE_TIME
            },
        });


        if (!backendRes.ok) {
            return apiError("Failed to get recent orders", backendRes.status);
        }
        const data: GetRecentOrdersResponse = await backendRes.json();


        return apiSuccess<GetRecentOrdersResponse>(data, backendRes.status);
    } catch {
        return apiError("Failed to get recent orders", 500);
    }
}
