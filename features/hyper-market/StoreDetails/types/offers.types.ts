export type HyperMarketOfferStatus = "active" | "inactive" | string;

export interface HyperMarketOffer {
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
    status: HyperMarketOfferStatus;
}

export interface GetHyperMarketOffersResponse {
    success: boolean;
    data: HyperMarketOffer[];
    message: string;
}
