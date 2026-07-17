"use client";

import Image from "@/shared/components/SecureImage";
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
    isArabic: boolean;
}

export const BrandItemCard = memo(function BrandItemCard({
    item,
    isArabic,
}: BrandItemCardProps) {
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
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            className="flex min-w-0 items-center gap-2.5 bg-background px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5 md:h-full md:rounded-2xl md:ring-1 md:ring-border"
        >
            <Link
                href={`/items/${item.id}?module_id=3`}
                aria-label={item.name}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-card outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-[72px] sm:w-[72px]"
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
                        <ShoppingBag className="h-7 w-7 text-muted" aria-hidden />
                    </div>
                )}
            </Link>

            <Link
                href={`/items/${item.id}?module_id=3`}
                aria-label={item.name}
                className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <p className="line-clamp-2 text-start text-sm font-semibold leading-snug text-foreground sm:text-[14px]">
                    {item.name}
                </p>

                {item.description && (
                    <p className="mt-0.5 line-clamp-1 text-start text-xs leading-snug text-muted sm:text-[12px]">
                        {item.description}
                    </p>
                )}

                <div className="mt-1.5 flex items-center gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[13px] font-bold leading-none text-brand"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={item.price}
                            size="sm"
                            className="text-[11px] leading-none text-muted line-through"
                        />
                    )}
                </div>
            </Link>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                    type="button"
                    aria-label={
                        wishlisted
                            ? isArabic
                                ? "إزالة من المفضلة"
                                : "Remove from favorites"
                            : isArabic
                              ? "إضافة إلى المفضلة"
                              : "Add to favorites"
                    }
                    aria-pressed={wishlisted}
                    onClick={handleToggleWishlist}
                    disabled={wishlistPending}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 transition-colors active:bg-brand/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 sm:h-8 sm:w-8"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            wishlisted
                                ? "fill-brand text-brand"
                                : "fill-none text-muted",
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
