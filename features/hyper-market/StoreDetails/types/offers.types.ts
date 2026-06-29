export type HyperMarketOfferStatus = "active" | "inactive" | string;

/** Single offer from GET /api/v1/offers/active → data[] */
export interface HyperMarketOffer {
    id: number;
    reference: string;
    name: string;
    start_date: string;
    end_date: string;
    discount_min: number;
    discount_max: number;
    banner: string;
    banner_full_url: string;
    module_id: number;
    zone_id: number | null;
    created_at: string;
    updated_at: string;
    items_count: number;
    status: HyperMarketOfferStatus;
}

export type GetHyperMarketOffersResponse =
    | { success: true; data: HyperMarketOffer[]; message: string }
    | { success: false; message: string };
