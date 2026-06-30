"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";

interface Props {
    product: CategoryProduct;
    layout?: "grid" | "list";
}

export const CategoryProductCard = memo(function CategoryProductCard({
    product,
    layout = "grid",
}: Props) {
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistPending, setWishlistPending] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const showImage = !imgError && !!product.full_image_url;
    const discountPercent = product.discount_percentage ?? 0;

    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: discountPercent,
    };

    async function toggleWishlist(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (wishlistPending) return;

        setWishlistPending(true);
        const wasLiked = wishlisted;
        setWishlisted(!wasLiked);

        const result = wasLiked
            ? await removeFromWishlist({ itemId: product.id })
            : await addToWishlist({ itemId: product.id });

        if (!result.success) {
            setWishlisted(wasLiked);
        }

        setWishlistPending(false);
    }

    const WishlistButton = (
        <button
            type="button"
            aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            onClick={toggleWishlist}
            disabled={wishlistPending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBFEEB] transition-colors active:bg-[#DCF5DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60"
        >
            <Heart
                className={[
                    "h-4 w-4 transition-colors",
                    wishlisted ? "fill-[#30913F] text-[#30913F]" : "fill-none text-[#30913F]",
                ].join(" ")}
                strokeWidth={wishlisted ? 0 : 1.8}
            />
        </button>
    );

    // ── List layout ───────────────────────────────────────────────────────────
    if (layout === "list") {
        return (
            <div
                dir="rtl"
                className="flex flex-row-reverse w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]"
            >
                {/* Actions column */}
                <div className="flex shrink-0 flex-col items-center justify-between self-stretch py-0.5 gap-3">
                    {WishlistButton}
                    <ProductAddControl
                        product={cartProduct}
                        isAvailable={true}
                        size="sm"
                        variant="soft"
                        className="h-8 w-8"
                    />
                </div>

                {/* Text column */}
                <Link
                    href={`/items/${product.id}?module_id=3`}
                    aria-label={product.name}
                    className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
                >
                    <p className="line-clamp-2 text-right text-sm font-bold leading-snug text-[#111B18]">
                        {product.name}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <PriceTag
                            amount={displayPrice}
                            size="sm"
                            className="text-[15px] font-bold leading-none text-[#111B18]"
                        />
                        {hasDiscount && (
                            <PriceTag
                                amount={product.price}
                                size="sm"
                                className="text-xs leading-none text-gray-400 line-through decoration-[#E53935]"
                            />
                        )}
                    </div>
                </Link>

                {/* Image column */}
                <Link
                    href={`/items/${product.id}?module_id=3`}
                    tabIndex={-1}
                    aria-hidden
                    className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-[#F7F9F7] outline-none"
                >
                    {hasDiscount && (
                        <span className="absolute end-1 top-1 z-10 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                            -{Math.round(discountPercent)}%
                        </span>
                    )}
                    {showImage ? (
                        <Image
                            src={product.full_image_url}
                            alt=""
                            fill
                            className="object-contain p-1.5"
                            sizes="80px"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-7 w-7 text-gray-300" aria-hidden />
                        </div>
                    )}
                </Link>
            </div>
        );
    }

    // ── Grid layout ───────────────────────────────────────────────────────────
    return (
        <div
            dir="rtl"
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]"
        >
            {/* Wishlist row */}
            <div className="flex items-center justify-end px-2.5 pt-2.5">
                {WishlistButton}
            </div>

            {/* Image */}
            <Link
                href={`/items/${product.id}?module_id=3`}
                aria-label={product.name}
                className="relative mx-2 aspect-square overflow-hidden rounded-xl bg-[#F7F9F7] outline-none
                           focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            >
                {hasDiscount && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        -{Math.round(discountPercent)}%
                    </span>
                )}
                {showImage ? (
                    <Image
                        src={product.full_image_url}
                        alt=""
                        fill
                        className="object-contain p-2 transition-transform duration-200 active:scale-95"
                        sizes="(max-width: 640px) 44vw, 200px"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-300" aria-hidden />
                    </div>
                )}
            </Link>

            {/* Info */}
            <Link
                href={`/items/${product.id}?module_id=3`}
                tabIndex={-1}
                aria-hidden
                className="flex flex-1 flex-col gap-1 px-2.5 pb-1 pt-2 outline-none"
            >
                <p className="line-clamp-2 min-h-[2.5em] text-right text-[12px] font-bold leading-snug text-[#111B18]">
                    {product.name}
                </p>

                <div className="flex items-center gap-1.5">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[13px] font-bold leading-none text-[#111B18]"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[11px] leading-none text-gray-400 line-through decoration-[#E53935]"
                        />
                    )}
                </div>
            </Link>

            {/* Add button row */}
            <div className="flex items-center justify-end px-2.5 pb-2.5">
                <ProductAddControl
                    product={cartProduct}
                    isAvailable={true}
                    size="sm"
                    variant="soft"
                    className="h-8 w-8"
                />
            </div>
        </div>
    );
});
