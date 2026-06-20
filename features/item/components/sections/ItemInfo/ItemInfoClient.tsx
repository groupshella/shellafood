import { Star } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ItemDetails, getDiscountedPrice, hasDiscount } from "@/features/item/types/item.types";
import { ItemGalleryClient } from "../ItemGallery/ItemGalleryClient";

interface ItemInfoClientProps {
    item: ItemDetails;
}

export function ItemInfoClient({ item }: ItemInfoClientProps) {
    const discounted = hasDiscount(item.discount);
    const displayPrice = getDiscountedPrice(item.price, item.discount, item.discount_type);
    const inStock = item.stock > 0;
    const showRating = item.rating_count > 0;

    return (
        <>
            <ItemGalleryClient title={item.name} images={item.images || []} name={item.name} />
            <div className="mt-0.5 bg-white px-4 py-4 sm:px-5">
                <h2 className="text-base font-bold leading-snug text-gray-900">{item.name}</h2>

                {item.store_name && <p className="mt-1 text-xs text-gray-500">{item.store_name}</p>}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {showRating && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#DFF5E3] px-2 py-1 text-xs font-bold text-gray-900">
                            {item.avg_rating.toFixed(1)}
                            <Star className="h-3 w-3 fill-[#45C553] text-[#45C553]" strokeWidth={0} />
                            <span className="font-normal text-gray-500">({item.rating_count})</span>
                        </span>
                    )}

                    <span
                        className={[
                            "rounded-lg px-2 py-1 text-xs font-semibold",
                            inStock ? "bg-[#E8F8E8] text-[#2F8F3B]" : "bg-red-50 text-red-600",
                        ].join(" ")}
                    >
                        {inStock ? "متوفر" : "غير متوفر"}
                    </span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                    {discounted && (
                        <PriceTag amount={item.price} size="sm" className="line-through" />
                    )}
                    <PriceTag amount={displayPrice} className="text-[#2F8F3B]" />
                    {discounted && (
                        <span className="mb-0.5 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            -{item.discount}%
                        </span>
                    )}
                </div>

                {item.description?.trim() && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <h3 className="mb-2 text-sm font-bold text-gray-900">الوصف</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                )}
            </div>
        </>
    );
}
