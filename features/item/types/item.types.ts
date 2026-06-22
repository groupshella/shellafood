// ─── Item details (from GET /api/v2/items/details/{item_id}) ──────────────────
export interface ItemDetails {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    image_full_url: string;
    stock: number;
    is_available: boolean;
}
