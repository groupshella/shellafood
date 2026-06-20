export interface StoreCategory {
    id: string | number;
    name: string;
    full_image_url: string | null;
    is_discount_category: boolean;
}

export type GetStoreCategoriesResponse = StoreCategory[];
