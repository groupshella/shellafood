"use client";

import { useMemo, useState } from "react";
import Image from "@/shared/components/SecureImage";
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
        <div
            className="bg-background"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 md:px-5 md:pt-5 lg:gap-10 lg:px-6">
                {/* Product image */}
                <div className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-2xl bg-card sm:mx-5 md:mx-0 md:mt-0">
                    {discounted && (
                        <span className="absolute start-3 top-3 z-10 rounded-lg bg-red-500 px-2 py-1 text-[11px] font-bold text-white sm:text-xs">
                            -{item.discount}%
                        </span>
                    )}
                    {!imgError && item.image_full_url ? (
                        <Image
                            src={item.image_full_url}
                            alt={item.name}
                            fill
                            className="object-contain p-5 sm:p-6 lg:p-8"
                            sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 320px, 440px"
                            priority
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingBag
                                className="h-14 w-14 text-muted sm:h-16 sm:w-16 md:h-20 md:w-20"
                                aria-hidden
                            />
                        </div>
                    )}
                </div>

                {/* Info block */}
                <div className="px-3 pb-6 pt-4 sm:px-5 md:flex md:min-h-full md:flex-col md:px-0 md:pb-8 md:pt-1">
                    <div className="flex items-start justify-between gap-3">
                        <h1 className="flex-1 text-start text-lg font-bold leading-snug text-foreground sm:text-xl lg:text-2xl">
                            {item.name}
                        </h1>
                        <button
                            type="button"
                            onClick={toggleWishlist}
                            disabled={wishlistPending}
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
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 sm:h-11 sm:w-11"
                        >
                            <Heart
                                className={[
                                    "h-5 w-5 transition-colors",
                                    wishlisted
                                        ? "fill-brand text-brand"
                                        : "fill-none text-foreground",
                                ].join(" ")}
                                strokeWidth={wishlisted ? 0 : 1.8}
                                aria-hidden
                            />
                        </button>
                    </div>

                    {item.description?.trim() && (
                        <p className="mt-2 text-start text-sm leading-relaxed text-muted lg:text-base">
                            {item.description}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 md:mt-auto md:pt-6">
                        <div className="flex flex-col items-end gap-1">
                            {discounted && (
                                <PriceTag
                                    amount={item.price}
                                    size="sm"
                                    className="text-xs text-muted line-through"
                                />
                            )}
                            <PriceTag
                                amount={displayPrice}
                                className="text-foreground"
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
                        <p className="mt-3 text-start text-xs font-semibold text-red-500 sm:text-sm">
                            {isArabic ? "غير متوفر حالياً" : "Currently unavailable"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
