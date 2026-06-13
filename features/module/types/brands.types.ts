export interface Brand {
    id: number;
    name: string;
    name_en: string;
    name_ar: string;
    slug: string;
    image: string;
    status: number;
    module_id: number;
    products_count: number;
    image_full_url: string;
}

export type GetBrandsResponse = Brand[];
