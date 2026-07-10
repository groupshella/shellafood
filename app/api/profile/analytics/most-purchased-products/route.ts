import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { ANALYTICS_ENDPOINTS } from "@/features/profile/constants/statistics.constants";
import { adaptProducts } from "@/features/profile/lib/statistics-adapters";
import type { StatisticsProduct } from "@/features/profile/types/statistics.types";
import {
    apiError,
    apiSuccess,
    extractBackendError,
} from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!token) return apiError("Unauthorized", 401);

    try {
        const res = await fetch(
            `${BACKEND_URL}${ANALYTICS_ENDPOINTS.mostPurchasedProducts}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-localization": "ar",
                    moduleId: MODULE_ID,
                    zoneId: ZONE_ID,
                },
                cache: "no-store",
            },
        );

        const json = await res.json();
        if (!res.ok) {
            return apiError(
                extractBackendError(json, "Failed to load most purchased products"),
                res.status,
            );
        }

        return apiSuccess<StatisticsProduct[]>(adaptProducts(json?.data ?? json));
    } catch {
        return apiError("Failed to load most purchased products", 502);
    }
}
