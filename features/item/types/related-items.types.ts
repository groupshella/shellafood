// ─── Related item (from GET /api/v2/items/related-items/{item_id}) ─────────────
export interface RelatedItem {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    image_full_url: string;
    stock: number;
    is_available: boolean;
}
