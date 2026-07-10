"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { StoreProduct } from "@/features/stores/types/store.types";

interface ProductCardProps {
    product: StoreProduct;
    moduleId: string;
}

export const ProductCard = memo(function ProductCard({ product, moduleId }: ProductCardProps) {
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const showImage = !imgError && !!product.full_image_url;
    const discountPercent = product.discount_percentage ?? 0;

    // Stable reference so memoized ProductAddControl isn't busted every render
    const cartProduct = useMemo(
        () => ({
            id: product.id,
            name: product.name,
            price: product.price,
            discount: discountPercent,
        }),
        [product.id, product.name, product.price, discountPercent],
    );

    const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlisted((p) => !p);
    }, []);

    const handleImgError = useCallback(() => {
        setImgError(true);
    }, []);

    return (
        <div
            dir="rtl"
            className="flex h-full min-w-0 w-full items-center gap-2.5 rounded-2xl bg-white px-2.5 py-2.5 shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] sm:gap-3 sm:px-3 sm:py-3"
        >
            <Link
                href={`/items/${product.id}?module_id=${moduleId}`}
                tabIndex={-1}
                aria-hidden
                className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-gray-100 outline-none dark:bg-gray-700 sm:h-[80px] sm:w-[80px]"
            >
                {hasDiscount && discountPercent > 0 && (
                    <span className="absolute end-1 top-1 z-10 rounded-md bg-red-100 px-1.5 py-0.5 text-[9px] font-bold leading-none text-red-600 dark:bg-red-950 dark:text-red-400 sm:text-[10px]">
                        -{Math.round(discountPercent)}%
                    </span>
                )}
                {showImage ? (
                    <Image
                        src={product.full_image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="(max-width: 640px) 72px, 80px"
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
                href={`/items/${product.id}?module_id=${moduleId}`}
                aria-label={product.name}
                className="min-w-0 flex-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            >
                <p className="line-clamp-2 text-start text-sm font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-[15px]">
                    {product.name}
                </p>

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

            <div className="flex shrink-0 flex-col items-center justify-between gap-2.5 self-stretch py-0.5 sm:gap-3">
                <button
                    type="button"
                    aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    aria-pressed={wishlisted}
                    onClick={handleToggleWishlist}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1 active:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:focus-visible:ring-offset-gray-800 dark:active:bg-gray-600 sm:h-10 sm:w-10"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            wishlisted
                                ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                                : "fill-none text-gray-500 dark:text-gray-400",
                        ].join(" ")}
                        strokeWidth={wishlisted ? 0 : 1.8}
                        aria-hidden
                    />
                </button>

                <ProductAddControl
                    product={cartProduct}
                    isAvailable={true}
                    size="sm"
                    variant="soft"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                />
            </div>
        </div>
    );
});
