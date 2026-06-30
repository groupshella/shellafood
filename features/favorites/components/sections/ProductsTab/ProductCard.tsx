"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Plus } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import type { FavoriteProduct } from "@/features/favorites/types/favorites.types";

interface ProductCardProps {
    product: FavoriteProduct;
    initialFavorited?: boolean;
    onRemove?: (itemId: number) => void;
}

export function ProductCard({
    product,
    initialFavorited = true,
    onRemove,
}: ProductCardProps) {
    const [imgError, setImgError] = useState(false);
    const [favorited, setFavorited] = useState(initialFavorited);
    const [pending, setPending] = useState(false);

    const hasDiscount =
        product.discounted_price != null &&
        product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const discountPercent =
        hasDiscount && product.discount != null ? Math.round(product.discount) : null;
    const showImage = !imgError && !!product.image;

    async function toggleFavorite(e: React.MouseEvent) {
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
        } else if (wasLiked && onRemove) {
            onRemove(product.id);
        }

        setPending(false);
    }

    return (
        <div
            dir="rtl"
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.04]"
        >
            {/* Product image */}
            <Link
                href={`/items/${product.id}`}
                tabIndex={-1}
                aria-hidden
                className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#F6F5F8] outline-none"
            >
                {discountPercent != null && (
                    <span className="absolute end-1 top-1 z-10 rounded-md bg-[#FFDCDC] px-1.5 py-0.5 text-[9px] font-bold leading-none text-[#DB2626]">
                        -{discountPercent}%
                    </span>
                )}
                {showImage ? (
                    <Image
                        src={product.image!}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="72px"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-7 w-7 text-gray-300" aria-hidden />
                    </div>
                )}
            </Link>

            {/* Text */}
            <Link
                href={`/items/${product.id}`}
                aria-label={product.name}
                className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            >
                <p className="line-clamp-2 text-[14px] font-bold leading-snug text-[#111B18]">
                    {product.name}
                </p>
                {product.unit_type && (
                    <p className="mt-0.5 text-[12px] text-[#707784]">
                        {product.unit_amount} {product.unit_type}
                    </p>
                )}
                <div className="mt-1.5 flex items-center gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[15px] font-bold leading-none text-[#111B18]"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[12px] leading-none text-[#CD1625] line-through"
                        />
                    )}
                </div>
            </Link>

            {/* Actions column */}
            <div className="flex shrink-0 flex-col items-center gap-2">
                {/* Heart toggle */}
                <button
                    type="button"
                    aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    onClick={toggleFavorite}
                    disabled={pending}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBFEEB] transition-colors active:bg-[#DCF5DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            favorited
                                ? "fill-[#30913F] text-[#30913F]"
                                : "fill-none text-[#30913F]",
                        ].join(" ")}
                        strokeWidth={favorited ? 0 : 1.8}
                    />
                </button>

                {/* Add to cart */}
                <button
                    type="button"
                    aria-label={`إضافة ${product.name} إلى السلة`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1FDD2] transition-colors active:bg-[#BBF7C4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                >
                    <Plus className="h-4 w-4 text-[#30913F]" strokeWidth={2.5} aria-hidden />
                </button>
            </div>
        </div>
    );
}
