import type {
    GetOfferNewItemsApiResponse,
    GetOfferSearchApiResponse,
    OfferItem,
    OfferItemApiResponse,
    OfferItemsResult,
} from "../types/offer.types";

export function normalizeOfferItem(item: OfferItemApiResponse): OfferItem {
    const imageUrl = item.image_full_url || item.image || "";
    const salePrice = item.discounted_price ?? item.price;
    const originalPrice = item.original_price > 0 ? item.original_price : salePrice;

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
        (item.status !== undefined ? item.status === 1 : true);

    return {
        id: item.id,
        name: item.name,
        description,
        image_full_url: imageUrl,
        price: originalPrice,
        discounted_price: salePrice,
        discount_percentage: Math.round(discountPct),
        available,
    };
}

/** Maps GET /api/v1/offers/{id}/newitems */
export function mapNewItemsResponse(json: GetOfferNewItemsApiResponse): OfferItemsResult {
    const items = (json.products ?? []).map(normalizeOfferItem);
    const total = json.products_count ?? 0;
    const offset = Number(json.offset) || 1;
    const limit = Number(json.limit) || 50;
    const pageCount = json.page_products_count ?? items.length;

    return {
        items,
        total,
        offset,
        limit,
        hasMore: (offset - 1) * limit + pageCount < total,
    };
}

/** Maps GET /api/v1/offers/{id}/search */
export function mapSearchItemsResponse(json: GetOfferSearchApiResponse): OfferItemsResult {
    const { pagination, items: rawItems } = json.data;
    const items = (rawItems ?? []).map(normalizeOfferItem);
    const offset = Number(pagination?.offset) || 1;
    const limit = Number(pagination?.limit) || 50;
    const total = pagination?.total ?? 0;

    return {
        items,
        total,
        offset,
        limit,
        hasMore: pagination?.has_more ?? false,
    };
}
