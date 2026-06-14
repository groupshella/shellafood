// ── Get Popular Brands ────────────────────────────────────────────────────────

export interface PopularBrand {
    id: number;
    name: string;
    image_full_url: string;
}

export type GetPopularBrandsResponse = PopularBrand[];
