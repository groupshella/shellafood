import {
    StoreDetails,
} from "@/features/store/types/store-details.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE;
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE;
const MODULE_ID = process.env.MODULE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;

const CATEGORY_LIMIT = 10;

function mapStoreDetails(data: StoreDetails): StoreDetails {
    const categories = (data.category_details ?? []).slice(0, CATEGORY_LIMIT).map((cat) => ({
        id: cat.id,
        name: cat.name,
        full_image_url: cat.full_image_url,
    }));

    return {
        store_name: data.store_name,
        store_description: data.store_description,
        rating: data.rating,
        rating_count: data.rating_count,
        free_delivery: Boolean(data.free_delivery),
        delivery_time: data.delivery_time,
        cover_photo_full_url: data.cover_photo_full_url,
        logo_full_url: data.logo_full_url,
        module_id: data.module_id,
        category_details: categories,
    };
}

export async function GET(
    request: Request,
) {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("module_id") ?? MODULE_ID;
    const id = searchParams.get("id") ?? "";
    const latitude = searchParams.get("latitude") ?? LATITUDE!;
    const longitude = searchParams.get("longitude") ?? LONGITUDE!;

    if (!id || Number.isNaN(Number(id))) {
        return apiError("Store ID is required", 400);
    }

    if (!moduleId || Number.isNaN(Number(moduleId))) {
        return apiError("Module ID is required", 400);
    }

    try {
        const backendParams = new URLSearchParams({
            limit: String(CATEGORY_LIMIT),
            offset: "0",
            include_categories: "1",
        });

        const backendRes = await fetch(
            `${BACKEND_URL}/api/v1/stores/details/${id}?${backendParams}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Localization": "ar",
                    moduleId,
                    zoneId: ZONE_ID!,
                    latitude,
                    longitude,
                },
                next: { revalidate: Number(REVALIDATE_TIME) },
            },
        );

        if (!backendRes.ok) {
            return apiError("Failed to get store details", backendRes.status);
        }

        const data = await backendRes.json() as StoreDetails;
        return apiSuccess<StoreDetails>(mapStoreDetails(data), backendRes.status);
    } catch {
        return apiError("Failed to get store details", 500);
    }
}
