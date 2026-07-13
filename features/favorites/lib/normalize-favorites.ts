import type {
    FavoriteOrder,
    FavoriteProduct,
    FavoriteStore,
    OrderListApiResponse,
} from "@/features/favorites/types/favorites.types";

type RawRecord = Record<string, unknown>;

function asNumber(value: unknown, fallback = 0): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

function asString(value: unknown): string | null {
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return null;
}

function asArray(value: unknown): RawRecord[] {
    return Array.isArray(value) ? (value as RawRecord[]) : [];
}

function unwrapWishlistResponse(json: unknown): {
    item: RawRecord[];
    store: RawRecord[];
} {
    if (!json || typeof json !== "object") {
        return { item: [], store: [] };
    }

    const root = json as RawRecord;
    const nested = (root.data ?? root) as RawRecord;

    return {
        item: asArray(nested.item ?? nested.items ?? root.item),
        store: asArray(nested.store ?? nested.stores ?? root.store),
    };
}

function toAbsoluteUrl(value: string | null): string {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
        return value;
    }

    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    if (!base) return value;

    return value.startsWith("/") ? `${base}${value}` : `${base}/${value}`;
}

function toFavoriteProduct(
    raw: RawRecord,
    wishlistedAt?: string | null
): FavoriteProduct {
    const unit = raw.unit as RawRecord | undefined;
    const price = asNumber(raw.price);
    const discountedPrice =
        raw.discounted_price != null ? asNumber(raw.discounted_price) : price;

    return {
        ...(raw as unknown as FavoriteProduct),
        id: asNumber(raw.id),
        name: asString(raw.name) ?? "",
        wishlisted_at:
            wishlistedAt ??
            asString(raw.wishlisted_at) ??
            asString(raw.created_at) ??
            "",
        price,
        discounted_price: discountedPrice,
        discount: raw.discount != null ? asNumber(raw.discount) : 0,
        module_id: asNumber(raw.module_id),
        store_id: asNumber(raw.store_id),
        image_full_url: toAbsoluteUrl(
            asString(raw.image_full_url) ?? asString(raw.image)
        ),
        unit_type: asString(raw.unit_type) ?? asString(unit?.unit) ?? "",
    };
}

function toFavoriteStore(
    raw: RawRecord,
    wishlistedAt?: string | null
): FavoriteStore {
    const deliveryTime = asString(raw.delivery_time) ?? "";

    return {
        ...(raw as unknown as FavoriteStore),
        id: asNumber(raw.id),
        name: asString(raw.name) ?? "",
        wishlisted_at:
            wishlistedAt ??
            asString(raw.wishlisted_at) ??
            asString(raw.created_at) ??
            "",
        logo: toAbsoluteUrl(
            asString(raw.logo_full_url) ?? asString(raw.logo)
        ),
        cover_photo: toAbsoluteUrl(
            asString(raw.cover_photo_full_url) ??
                asString(raw.cover_photo) ??
                asString(raw.banner_full_url) ??
                asString(raw.banner)
        ),
        avg_rating: asNumber(raw.avg_rating),
        free_delivery: Boolean(raw.free_delivery),
        delivery_time: deliveryTime,
        module_type: asString(raw.module_type) ?? undefined,
        module_id: asNumber(raw.module_id),
    };
}

/**
 * Products may be:
 * - flat product objects (current API)
 * - wrappers `{ id, item, unavailable, wishlisted_at }` (legacy)
 */
export function normalizeWishlistProduct(
    entry: RawRecord
): FavoriteProduct | null {
    const nested = entry.item;

    if (nested && typeof nested === "object") {
        return toFavoriteProduct(
            nested as RawRecord,
            asString(entry.wishlisted_at)
        );
    }

    // Flat product — must have a name (skips unavailable stubs with only id)
    if (asString(entry.name)) {
        return toFavoriteProduct(entry);
    }

    return null;
}

/**
 * Stores may be:
 * - flat store objects (current API — same pattern as products)
 * - wrappers `{ id, store, unavailable, wishlisted_at }` (legacy)
 */
export function normalizeWishlistStore(entry: RawRecord): FavoriteStore | null {
    const nested = entry.store;

    if (nested && typeof nested === "object") {
        return toFavoriteStore(
            nested as RawRecord,
            asString(entry.wishlisted_at)
        );
    }

    // Flat store — must have a name (skips `{ id, store: null, unavailable: true }`)
    if (asString(entry.name)) {
        return toFavoriteStore(entry);
    }

    return null;
}

function dedupeById<T extends { id: number }>(items: T[]): T[] {
    const seen = new Set<number>();
    const result: T[] = [];

    for (const item of items) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        result.push(item);
    }

    return result;
}

export function mapWishlistResponse(json: unknown): {
    products: FavoriteProduct[];
    stores: FavoriteStore[];
} {
    const data = unwrapWishlistResponse(json);

    const products = dedupeById(
        data.item
            .map(normalizeWishlistProduct)
            .filter((product): product is FavoriteProduct => product != null)
    );

    const stores = dedupeById(
        data.store
            .map(normalizeWishlistStore)
            .filter((entry): entry is FavoriteStore => entry != null)
    );

    return { products, stores };
}

export function normalizeFavoriteOrder(raw: RawRecord): FavoriteOrder | null {
    const id = asNumber(raw.id);
    if (!id) return null;

    const store = (raw.store ?? raw.restaurant) as RawRecord | undefined;

    return {
        id,
        order_status: asString(raw.order_status) ?? "pending",
        order_amount: asNumber(raw.order_amount),
        order_time: asString(raw.order_time) ?? asString(raw.order_date) ?? "",
        store_name: asString(store?.name) ?? "المتجر",
        store_logo_url: toAbsoluteUrl(
            asString(store?.logo_full_url) ?? asString(store?.logo)
        ) || null,
        wishlisted_at:
            asString(raw.wishlisted_at) ??
            asString(raw.updated_at) ??
            asString(raw.created_at) ??
            "",
    };
}

export function mapFavoriteOrdersResponse(
    json: OrderListApiResponse
): FavoriteOrder[] {
    return asArray(json.orders)
        .map(normalizeFavoriteOrder)
        .filter((order): order is FavoriteOrder => order != null);
}
