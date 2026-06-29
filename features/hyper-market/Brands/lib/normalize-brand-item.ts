import type {
    BrandItem,
    ItemSearchRawItem,
    ItemsSearchApiResponse,
} from "../types/brands.types";

export function normalizeItem(item: ItemSearchRawItem): BrandItem {
    const originalPrice = item.original_price > 0 ? item.original_price : item.price;
    const salePrice = item.discounted_price ?? item.price;

    const discountPct =
        item.discount_type === "percent"
            ? item.discount
            : originalPrice > 0
              ? ((originalPrice - salePrice) / originalPrice) * 100
              : 0;

    const description =
        item.description?.trim() || item.unit_type?.trim() || undefined;

    const available =
        item.availability?.is_available ??
        item.in_stock ??
        item.status === 1;

    return {
        id: item.id,
        name: item.name,
        description,
        image_full_url: item.image_full_url,
        price: originalPrice,
        discounted_price: salePrice,
        discount_percentage: Math.round(discountPct),
        available,
    };
}

export function mapItemsSearchResponse(
    json: ItemsSearchApiResponse
): { items: BrandItem[]; total: number } {
    return {
        items: (json.products ?? []).map(normalizeItem),
        total: json.products_count ?? 0,
    };
}

/** @deprecated use mapItemsSearchResponse */
export const mapBrandItemsResponse = mapItemsSearchResponse;
/** @deprecated use normalizeItem */
export const normalizeBrandItem = normalizeItem;
