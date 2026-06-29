import { type NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/shared/lib/api-response";

function backendHeaders(): HeadersInit {
    return {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": "ar",
        zoneId: process.env.ZONE_ID!,
        "zone-id": process.env.ZONE_ID!,
        moduleId: process.env.MODULE_ID ?? "3",
        "module-id": process.env.MODULE_ID ?? "3",
        latitude: process.env.NEXT_PUBLIC_LATITUDE ?? "",
        longitude: process.env.NEXT_PUBLIC_LONGITUDE ?? "",
    };
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ brandId: string }> }
) {
    const { brandId } = await params;
    const { searchParams } = req.nextUrl;

    const query = searchParams.get("query") ?? "";
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "50";

    const backendParams = new URLSearchParams({
        brand_id: brandId,
        name: query,
        page,
        limit,
    });

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/items/search?${backendParams}`,
            { headers: backendHeaders(), cache: "no-store" }
        );

        if (!res.ok) return apiError("Search failed", res.status);

        return apiSuccess(await res.json());
    } catch {
        return apiError("Search failed", 500);
    }
}
