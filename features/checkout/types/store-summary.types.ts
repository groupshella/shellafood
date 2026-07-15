/** Raw payload from GET /api/v2/checkout/store-summary */
export interface StoreSummaryApiData {
    id: number;
    name: string;
    address: string;
    latitude: string | number;
    longitude: string | number;
    logo: string | null;
    avg_rating: number;
    rating_count: number;
    distance: number | null;
    open: boolean;
    zone_id: number;
    tax: number;
    self_delivery_system: number;
    minimum_order: number;
    free_delivery: boolean;
    minimum_shipping_charge: number;
    maximum_shipping_charge: number;
    per_km_shipping_charge: number;
    first_km_fee: number;
    first_km_distance: number;
    extra_packaging_status: boolean;
    extra_packaging_amount: number;
    prescription_order: boolean;
    cutlery: boolean;
    version_hash: string | null;
}

export interface StoreSummaryApiResponse {
    status: boolean;
    data: StoreSummaryApiData;
}

/** Normalized store summary used across checkout UI + pricing. */
export interface CheckoutStoreSummary {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    logo: string | null;
    avgRating: number;
    ratingCount: number;
    open: boolean;
    zoneId: number;
    /** VAT percentage from the store (typically 15 in KSA). */
    taxPercent: number;
    minimumOrder: number;
    freeDelivery: boolean;
    minimumShippingCharge: number;
    maximumShippingCharge: number;
    perKmShippingCharge: number;
    firstKmFee: number;
    firstKmDistance: number;
    extraPackagingStatus: boolean;
    extraPackagingAmount: number;
    cutlery: boolean;
}
