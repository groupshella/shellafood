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

    const backendParams = new URLSearchParams({ brand_id: brandId });

    // Forward recognised filter params using the correct backend names
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const sortBy = searchParams.get("sort_by");
    const sortOrder = searchParams.get("sort_order");
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "50";

    if (minPrice) backendParams.set("min_price", minPrice);
    if (maxPrice) backendParams.set("max_price", maxPrice);
    if (sortBy) backendParams.set("sort_by", sortBy);
    if (sortOrder) backendParams.set("sort_order", sortOrder);
    backendParams.set("page", page);
    backendParams.set("limit", limit);

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/items/search?${backendParams}`,
            { headers: backendHeaders(), cache: "no-store" }
        );

        if (!res.ok) return apiError("Filter failed", res.status);

        return apiSuccess(await res.json());
    } catch {
        return apiError("Filter failed", 500);
    }
}
