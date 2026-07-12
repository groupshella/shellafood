"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { ItemDetails } from "@/features/item/types/item.types";
import { useNotification } from "@/shared/components/NotificationToast";

interface ItemInfoClientProps {
    item: ItemDetails;
    isArabic: boolean;
}

export function ItemInfoClient({ item, isArabic }: ItemInfoClientProps) {
    const { success, error: notifyError } = useNotification();
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistPending, setWishlistPending] = useState(false);

    const discounted = item.discount > 0;
    const displayPrice = discounted
        ? item.price * (1 - item.discount / 100)
        : item.price;

    // Stable reference so memoized ProductAddControl isn't busted every render
    const product = useMemo(
        () => ({
            id: item.id,
            name: item.name,
            price: item.price,
            discount: item.discount,
        }),
        [item.id, item.name, item.price, item.discount],
    );

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
            notifyError(result.message);
        } else {
            success(result.message);
        }

        setWishlistPending(false);
    }

    return (
        <div className="bg-white dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
            <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 md:px-5 md:pt-5 lg:gap-10 lg:px-6">
                {/* Product image */}
                <div className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 sm:mx-5 md:mx-0 md:mt-0">
                    {discounted && (
                        <span className="absolute start-3 top-3 z-10 rounded-lg bg-red-500 px-2 py-1 text-[11px] font-bold text-white sm:text-xs">
                            -{item.discount}%
                        </span>
                    )}
                    {!imgError && item.image_full_url ? (
                        <Image
                            src={item.image_full_url}
                            alt={item.name || isArabic ? "صورة المنتج" : "Product image"}
                            fill
                            className="object-contain p-5 sm:p-6 lg:p-8"
                            sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 320px, 440px"
                            priority
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-14 w-14 text-gray-300 dark:text-gray-600 sm:h-16 sm:w-16" aria-hidden />
                        </div>
                    )}
                </div>

                {/* Info block */}
                <div className="px-3 pb-6 pt-4 sm:px-5 md:flex md:min-h-full md:flex-col md:px-0 md:pb-8 md:pt-1">
                    <div className="flex items-start justify-between gap-3">
                        <h1 className="flex-1 text-start text-lg font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-xl lg:text-2xl">
                            {item.name || isArabic ? "اسم المنتج" : "Product name"}
                        </h1>
                        <button
                            type="button"
                            onClick={toggleWishlist}
                            disabled={wishlistPending}
                            aria-label={wishlisted ? (isArabic ? "إزالة من المفضلة" : "Remove from favorites") : (isArabic ? "إضافة إلى المفضلة" : "Add to favorites")}
                            aria-pressed={wishlisted}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60 dark:bg-gray-800 dark:active:bg-gray-700 sm:h-11 sm:w-11"
                        >
                            <Heart
                                className={[
                                    "h-5 w-5 transition-colors",
                                    wishlisted
                                        ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                                        : "fill-none text-gray-700 dark:text-gray-300",
                                ].join(" ")}
                                strokeWidth={wishlisted ? 0 : 1.8}
                                aria-hidden
                            />
                        </button>
                    </div>

                    {item.description?.trim() && (
                        <p className="mt-2 text-start text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
                            {item.description || isArabic ? "وصف المنتج" : "Product description"}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 md:mt-auto md:pt-6">
                        <div className="flex flex-col items-end gap-1">
                            {discounted && (
                                <PriceTag
                                    amount={item.price}
                                    size="sm"
                                    className="text-xs text-gray-400 line-through dark:text-gray-500"
                                />
                            )}
                            <PriceTag
                                amount={displayPrice}
                                className="text-gray-900 dark:text-gray-50"
                            />
                        </div>

                        <ProductAddControl
                            product={product}
                            isAvailable={item.is_available}
                            size="md"
                            variant="soft"
                        />
                    </div>

                    {!item.is_available && (
                        <p className="mt-3 text-start text-xs font-semibold text-red-500 dark:text-red-400 sm:text-sm">
                            {isArabic ? "غير متوفر حالياً" : "Not available currently"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
