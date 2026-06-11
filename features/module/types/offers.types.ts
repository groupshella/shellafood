// ── Get Offers ────────────────────────────────────────────────────────────────

export type OfferStatus = "active" | "inactive" | string;

/** Raw offer item from the backend `data` array (before mapping). */
export interface Offer {
    id: number;
    reference: string;
    name: string;
    start_date: string;
    end_date: string;
    discount_min: number;
    discount_max: number;
    banner: string;
    module_id: number;
    zone_id: number | null;
    created_at: string;
    updated_at: string;
    items_count: number;
    active: boolean;
    status: OfferStatus;
}

export interface GetOffersResponse {
    success: boolean;
    data: Offer[];
    message: string;
}
