"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { Heart, ShoppingBag, Plus } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { useNotification } from "@/shared/components/NotificationToast";
import type { FavoriteProduct } from "@/features/favorites/types/favorites.types";

interface ProductCardProps {
    product: FavoriteProduct;
    initialFavorited?: boolean;
    onRemove?: (itemId: number) => void;
}

export const ProductCard = memo(function ProductCard({
    product,
    initialFavorited = true,
    onRemove,
}: ProductCardProps) {
    const [imgError, setImgError] = useState(false);
    const [favorited, setFavorited] = useState(initialFavorited);
    const [pending, setPending] = useState(false);
    const { success, error: notifyError } = useNotification();

    const hasDiscount =
        product.discounted_price != null &&
        product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const discountPercent =
        hasDiscount && product.discount != null ? Math.round(product.discount) : null;
    const imageUrl = product.image_full_url || product.image;
    const showImage = !imgError && !!imageUrl;

    const handleImgError = useCallback(() => {
        setImgError(true);
    }, []);

    const toggleFavorite = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (pending) return;
            setPending(true);

            const wasLiked = favorited;
            setFavorited(!wasLiked);

            const result = wasLiked
                ? await removeFromWishlist({ itemId: product.id })
                : await addToWishlist({ itemId: product.id });

            if (!result.success) {
                setFavorited(wasLiked);
                notifyError(result.message);
            } else {
                success(result.message);
                if (wasLiked && onRemove) onRemove(product.id);
            }

            setPending(false);
        },
        [pending, favorited, product.id, onRemove, notifyError, success],
    );

    return (
        <div
            dir="rtl"
            className="flex h-full min-w-0 items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] sm:gap-3 sm:px-4 sm:py-3"
        >
            <Link
                href={`/items/${product.id}?module_id=${product.module_id}`}
                tabIndex={-1}
                aria-hidden
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 outline-none dark:bg-gray-700 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20"
            >
                {discountPercent != null && (
                    <span className="absolute end-1 top-1 z-10 rounded-md bg-red-100 px-1.5 py-0.5 text-[9px] font-bold leading-none text-red-600 dark:bg-red-950 dark:text-red-400 sm:text-[10px]">
                        -{discountPercent}%
                    </span>
                )}
                {showImage ? (
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 72px, 80px"
                        loading="lazy"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-300 dark:text-gray-600 sm:h-7 sm:w-7" aria-hidden />
                    </div>
                )}
            </Link>

            <Link
                href={`/items/${product.id}?module_id=${product.module_id}`}
                aria-label={product.name}
                className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            >
                <p className="line-clamp-2 text-start text-sm font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-[15px]">
                    {product.name}
                </p>
                {product.unit_type && (
                    <p className="mt-0.5 truncate text-start text-xs text-gray-500 dark:text-gray-400 sm:text-[13px]">
                        {product.unit_type}
                    </p>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2 sm:gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-sm font-bold leading-none text-gray-900 dark:text-gray-50"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-xs leading-none text-red-400 line-through dark:text-red-500"
                        />
                    )}
                </div>
            </Link>

            <div className="flex shrink-0 flex-col items-center justify-between gap-2 self-stretch py-0.5 sm:gap-2.5">
                <button
                    type="button"
                    aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    aria-pressed={favorited}
                    onClick={toggleFavorite}
                    disabled={pending}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBFEEB] transition-colors active:bg-[#DCF5DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60 dark:bg-[#0d2e12] dark:active:bg-[#163d1c] sm:h-10 sm:w-10"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            favorited
                                ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                                : "fill-none text-[#30913F] dark:text-[#4db860]",
                        ].join(" ")}
                        strokeWidth={favorited ? 0 : 1.8}
                        aria-hidden
                    />
                </button>

                <button
                    type="button"
                    aria-label={`إضافة ${product.name} إلى السلة`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D1FDD2] transition-colors active:bg-[#BBF7C4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-[#163d1c] dark:active:bg-[#1a4d20] sm:h-10 sm:w-10"
                >
                    <Plus className="h-4 w-4 text-[#30913F] dark:text-[#4db860] sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} aria-hidden />
                </button>
            </div>
        </div>
    );
});
