"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { useNotification } from "@/shared/components/NotificationToast";
import type { BrandItem } from "@/features/brands/types/brands.types";

interface BrandItemCardProps {
    item: BrandItem;
}

export const BrandItemCard = memo(function BrandItemCard({ item }: BrandItemCardProps) {
    const { success, error: notifyError } = useNotification();
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistPending, setWishlistPending] = useState(false);
    const hasDiscount = item.discount_percentage > 0 && item.discounted_price < item.price;
    const displayPrice = hasDiscount ? item.discounted_price : item.price;
    const showImage = !imgError && !!item.image_full_url;

    const cartProduct = useMemo(
        () => ({
            id: item.id,
            name: item.name,
            price: item.price,
            discount: item.discount_percentage,
        }),
        [item.id, item.name, item.price, item.discount_percentage],
    );

    const handleImgError = useCallback(() => {
        setImgError(true);
    }, []);

    const handleToggleWishlist = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
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
        },
        [wishlistPending, wishlisted, item.id, notifyError, success],
    );

    return (
        <div
            dir="rtl"
            className="flex min-w-0 items-center gap-2.5 bg-white px-3 py-3 dark:bg-gray-900 sm:gap-3 sm:px-4 sm:py-3.5 md:h-full md:rounded-2xl md:ring-1 md:ring-black/[0.04] md:dark:ring-white/[0.06]"
        >
            <Link
                href={`/items/${item.id}?module_id=3`}
                aria-label={item.name}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F6F5F8] outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 sm:h-[72px] sm:w-[72px]"
                tabIndex={-1}
            >
                {hasDiscount && (
                    <span className="absolute start-0 top-0 z-10 rounded-ee-md rounded-es-none bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        -{Math.round(item.discount_percentage)}%
                    </span>
                )}

                {showImage ? (
                    <Image
                        src={item.image_full_url}
                        alt={item.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="72px"
                        loading="lazy"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-7 w-7 text-gray-300 dark:text-gray-600" aria-hidden />
                    </div>
                )}
            </Link>

            <Link
                href={`/items/${item.id}?module_id=3`}
                aria-label={item.name}
                className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
                <p className="line-clamp-2 text-start text-sm font-semibold leading-snug text-[#111B18] dark:text-gray-50 sm:text-[14px]">
                    {item.name}
                </p>

                {item.description && (
                    <p className="mt-0.5 line-clamp-1 text-start text-xs leading-snug text-gray-400 dark:text-gray-500 sm:text-[12px]">
                        {item.description}
                    </p>
                )}

                <div className="mt-1.5 flex items-center gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[13px] font-bold leading-none text-[#2F8F3B] dark:text-[#4db860]"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={item.price}
                            size="sm"
                            className="text-[11px] leading-none text-gray-300 line-through dark:text-gray-500"
                        />
                    )}
                </div>
            </Link>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                    type="button"
                    aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    aria-pressed={wishlisted}
                    onClick={handleToggleWishlist}
                    disabled={wishlistPending}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBFEEB] transition-colors active:bg-[#DCF5DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60 dark:bg-[#30913F]/15 dark:active:bg-[#30913F]/25 sm:h-8 sm:w-8"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            wishlisted
                                ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                                : "fill-none text-gray-400 dark:text-gray-500",
                        ].join(" ")}
                        strokeWidth={wishlisted ? 0 : 1.8}
                        aria-hidden
                    />
                </button>

                <ProductAddControl
                    product={cartProduct}
                    isAvailable={item.available ?? true}
                    size="sm"
                />
            </div>
        </div>
    );
});
