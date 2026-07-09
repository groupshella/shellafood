"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { SearchProduct } from "@/features/search/types/search.types";

interface SearchProductCardProps {
    product: SearchProduct;
}

export const SearchProductCard = memo(function SearchProductCard({
    product,
}: SearchProductCardProps) {
    const [imgErr, setImgErr] = useState(false);
    const hasDiscount = product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price : product.price;
    const discountPercent =
        product.discount > 0
            ? product.discount
            : hasDiscount
                ? Math.round((1 - product.discounted_price / product.price) * 100)
                : 0;
    const isAvailable = product.availability?.is_available ?? true;

    const cartProduct = useMemo(
        () => ({
            id: product.id,
            name: product.name,
            price: product.price,
            discount: discountPercent,
        }),
        [product.id, product.name, product.price, discountPercent],
    );

    const handleImgError = useCallback(() => {
        setImgErr(true);
    }, []);

    return (
        <Link
            href={`/items/${product.id}?module_id=${product.module_id}`}
            dir="rtl"
            aria-label={product.name}
            className={[
                "relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-white",
                "border border-gray-200 dark:border-gray-700 dark:bg-gray-800",
                "transition-transform duration-150 active:scale-[0.97]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
                "sm:rounded-2xl",
            ].join(" ")}
        >
            <div className="relative px-2.5 pb-2 pt-2.5 sm:px-3 sm:pb-2 sm:pt-3">
                {discountPercent > 0 && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold leading-none text-red-600 dark:bg-red-950 dark:text-red-400 sm:start-2 sm:top-2 sm:text-[11px]">
                        -{discountPercent}%
                    </span>
                )}

                <div className="relative mx-auto aspect-square w-full">
                    {!imgErr && product.image_full_url ? (
                        <Image
                            src={product.image_full_url}
                            alt={product.name}
                            fill
                            className="object-contain p-1 sm:p-1.5"
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
                            loading="lazy"
                            onError={handleImgError}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-7 w-7 text-gray-200 dark:text-gray-600 sm:h-8 sm:w-8" aria-hidden />
                        </div>
                    )}
                </div>

                <div className="absolute end-1.5 top-1/2 z-10 -translate-y-1/4 sm:end-2">
                    <ProductAddControl
                        product={cartProduct}
                        isAvailable={isAvailable}
                        size="sm"
                        variant="soft"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 px-2.5 pb-2.5 sm:gap-2 sm:px-3 sm:pb-3">
                <p className="line-clamp-2 min-h-[2.4em] text-start text-xs font-bold leading-snug text-gray-900 dark:text-gray-50 sm:min-h-[2.6em] sm:text-[13px] md:text-sm">
                    {product.name}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-start gap-1.5 sm:gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-xs font-bold leading-none text-gray-900 dark:text-gray-50 sm:text-sm"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[11px] leading-none text-gray-400 line-through dark:text-gray-500 sm:text-xs"
                        />
                    )}
                </div>
            </div>
        </Link>
    );
});
