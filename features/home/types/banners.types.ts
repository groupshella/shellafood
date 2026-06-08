// ── Get Banners ───────────────────────────────────────────────────────────────

interface GetBannersRequest {
    /** Optional – when "1" or "true", returns promotional module banners */
    featured?: string;
}

interface BannerStore {
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

interface BannerItem {
    id: number;
    name: string;
    image: string;
    price: number;
    discount: number;
    store_id: number;
}

export interface Banner {
    id: number;
    title: string;
    type: "default" | "store_wise" | "item_wise" | string;
    image: string;
    image_full_url: string;
    link: string | null;
    store: BannerStore | null;
    item: BannerItem | null;
}

export interface Campaign {
    id: number;
    title: string;
    image: string;
    image_full_url?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
}

export interface GetBannersResponse {
    banners: Banner[];
    campaigns: Campaign[];
}
