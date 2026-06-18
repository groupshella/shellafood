export interface ItemImage {
    img: string;
    storage: string;
}

export interface ItemDetails {
    id: number;
    name: string;
    description: string;
    image_full_url: string;
    price: number;
    discount: number;
    discount_type?: string;
    avg_rating: number;
    rating_count: number;
    stock: number;
    images?: ItemImage[];
    store_name?: string;
}

export function getDiscountedPrice(
    price: number,
    discount: number,
    discountType: string = "percent",
): number {
    if (!discount || discount <= 0) return price;
    if (discountType === "amount") return Math.max(0, price - discount);
    return price * (1 - discount / 100);
}

export function hasDiscount(discount: number): boolean {
    return discount > 0;
}

export function getItemImages(item: Pick<ItemDetails, "image_full_url" | "images">): string[] {
    const fromGallery = (item.images ?? []).map((img) => img.img).filter(Boolean);
    const urls = item.image_full_url ? [item.image_full_url, ...fromGallery] : fromGallery;
    return [...new Set(urls)];
}
