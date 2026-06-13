import { GetModulesResponse } from "@/features/home/types/modules.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

export async function GET() {
    try {
        const backendRes = await fetch(
            `${BACKEND_URL}/api/v2/modules?zone_id=${ZONE_ID}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Localization": "ar",
                },
                next: { revalidate: Number(REVALIDATE_TIME) },
            },
        );

        if (!backendRes.ok) {
            return apiError("Failed to get modules", backendRes.status);
        }

        const body = await backendRes.json();
        const modules: GetModulesResponse = Array.isArray(body) ? body : body.data;
        return apiSuccess<GetModulesResponse>(modules, backendRes.status);
    } catch {
        return apiError("Failed to get modules", 500);
    }
}
