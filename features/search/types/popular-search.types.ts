// ── Get Popular Search ────────────────────────────────────────────────────────

export interface PopularSearchItem {
    keyword: string;
    count: number;
}

export type GetPopularSearchResponse = PopularSearchItem[];
