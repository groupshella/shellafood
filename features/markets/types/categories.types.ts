// ── Get Categories ────────────────────────────────────────────────────────────

export interface Category {
    id: number;
    name: string;
    slug: string;
    image_full_url: string;
}

export interface BackendCategoriesResponse {
    success: boolean;
    data: Category[];
}

export type GetCategoriesResponse = Category[];
