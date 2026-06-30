"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { ItemDetails } from "@/features/item/types/item.types";

interface ItemInfoClientProps {
    item: ItemDetails;
}

export function ItemInfoClient({ item }: ItemInfoClientProps) {
    const [imgError, setImgError] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistPending, setWishlistPending] = useState(false);

    const discounted = item.discount > 0;
    const displayPrice = discounted
        ? item.price * (1 - item.discount / 100)
        : item.price;

    const product = {
        id: item.id,
        name: item.name,
        price: item.price,
        discount: item.discount,
    };

    async function toggleWishlist() {
        if (wishlistPending) return;

        setWishlistPending(true);
        const wasLiked = wishlisted;
        setWishlisted(!wasLiked);

        const result = wasLiked
            ? await removeFromWishlist({ itemId: item.id })
            : await addToWishlist({ itemId: item.id });

        if (!result.success) {
            setWishlisted(wasLiked);
        }

        setWishlistPending(false);
    }

    return (
        <div className="bg-white" dir="rtl">


            <div className="relative mx-4 aspect-square overflow-hidden rounded-2xl bg-[#F7F9F7] sm:mx-5">
                {discounted && (
                    <span className="absolute start-3 top-3 z-10 rounded-lg bg-[#E53935] px-2 py-1 text-[11px] font-bold text-white">
                        -{item.discount}%
                    </span>
                )}
                {!imgError && item.image_full_url ? (
                    <Image
                        src={item.image_full_url}
                        alt={item.name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) calc(100vw - 32px), 480px"
                        priority
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-gray-200" aria-hidden />
                    </div>
                )}
            </div>

            <div className="px-4 pb-4 pt-4 sm:px-5">

                <div className="flex items-center justify-between">
                    <h1 className="text-right text-lg font-bold leading-snug text-[#111B18] sm:text-xl">
                        {item.name}
                    </h1>
                    <button
                        type="button"
                        onClick={toggleWishlist}
                        disabled={wishlistPending}
                        aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                        className="flex h-full items-center justify-center rounded-full bg-gray-100 p-3 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60"
                    >
                        <Heart
                            className={[
                                "h-6 w-6 transition-colors",
                                wishlisted
                                    ? "fill-[#30913F] text-[#30913F]"
                                    : "fill-none text-[#111B18]",
                            ].join(" ")}
                            strokeWidth={wishlisted ? 0 : 1.8}
                        />
                    </button>
                </div>
                {item.description?.trim() && (
                    <p className="mt-1.5 text-right block text-xs leading-relaxed text-gray-500">
                        {item.description}
                    </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex flex-col items-end gap-0.5">
                        {discounted && (
                            <PriceTag
                                amount={item.price}
                                size="sm"
                                className="text-[12px] text-gray-400 line-through"
                            />
                        )}
                        <PriceTag amount={displayPrice} className="text-[#111B18]" />
                    </div>

                    <ProductAddControl
                        product={product}
                        isAvailable={item.is_available}
                        size="md"
                        variant="soft"
                        onError={setAddError}
                    />
                </div>

                {addError && (
                    <p className="mt-2 text-center text-xs text-red-500">{addError}</p>
                )}

                {!item.is_available && (
                    <p className="mt-2 text-right text-xs font-semibold text-red-500">
                        غير متوفر
                    </p>
                )}
            </div>
        </div>
    );
}
