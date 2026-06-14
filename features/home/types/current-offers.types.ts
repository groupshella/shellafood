
export type DiscountType = "percent" | "flat" | string;

export interface CurrentOffer {
    store_id: number;
    store_name: string;
    store_logo_full_url: string;
    offer_title: string;
    description: string;
    original_price: number;
    discounted_price: number;
    discount_amount: number;
    discount_type: DiscountType;
    image_full_url: string;
    module_id: number;
}

export interface GetCurrentOffersResponse {
    offers: CurrentOffer[];
    total_size: number;
    limit: number;
    offset: number;
}
