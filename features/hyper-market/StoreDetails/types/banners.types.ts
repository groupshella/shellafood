export interface HyperMarketBannerStore {
    id: number;
    name: string;
    slug: string;
    logo: string;
    cover_photo: string;
    avg_rating: number;
    rating_count: number;
    delivery_time: string;
    minimum_order: number;
    free_delivery: boolean;
    zone_id: number;
    module_id: number;
}

export interface HyperMarketBannerItem {
    id: number;
    name: string;
    image: string;
    price: number;
    discount: number;
    store_id: number;
}

export interface HyperMarketBanner {
    id: number;
    title: string;
    type: "default" | "store_wise" | "item_wise" | string;
    image: string;
    image_full_url: string;
    link: string | null;
    store: HyperMarketBannerStore | null;
    item: HyperMarketBannerItem | null;
}

export interface HyperMarketCampaign {
    id: number;
    title: string;
    image: string;
    image_full_url?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
}

export interface GetHyperMarketBannersResponse {
    banners: HyperMarketBanner[];
    campaigns: HyperMarketCampaign[];
}
