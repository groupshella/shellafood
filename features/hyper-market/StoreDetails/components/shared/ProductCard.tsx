"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";

interface ProductCardProps {
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
}

export const ProductCard = memo(function ProductCard({
    productId,
    name,
    imageUrl,
    price,
    originalPrice,
}: ProductCardProps) {
    const hasDiscount = originalPrice != null && originalPrice > price;
    const discount = useMemo(() => {
        if (!hasDiscount || !originalPrice) return 0;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    }, [hasDiscount, originalPrice, price]);

    const cartProduct = useMemo(
        () => ({
            id: productId,
            name,
            price: originalPrice ?? price,
            discount,
        }),
        [productId, name, originalPrice, price, discount],
    );

    return (
        <div
            dir="rtl"
            className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:bg-gray-800 dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
        >
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-xl bg-[#F7F9F7] dark:bg-gray-700">
                <Link
                    href={`/items/${productId}`}
                    className="absolute inset-0 outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                    aria-label={name}
                >
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="120px"
                            loading="lazy"
                        />
                    ) : null}
                </Link>
                <div className="absolute bottom-1.5 start-1.5 z-10">
                    <ProductAddControl
                        product={cartProduct}
                        isAvailable
                        size="sm"
                        variant="solid"
                        className="h-6 w-6 sm:h-7 sm:w-7"
                    />
                </div>
            </div>

            <Link
                href={`/items/${productId}`}
                tabIndex={-1}
                aria-hidden
                className="flex flex-1 flex-col gap-0.5 p-2 outline-none sm:p-2.5"
            >
                <p className="line-clamp-2 text-start text-[11px] font-semibold leading-tight text-[#111B18] dark:text-gray-50 sm:text-xs">
                    {name}
                </p>
                <div className="mt-auto flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#111B18] dark:text-gray-50">
                        {price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through dark:text-gray-500">
                            {originalPrice!.toFixed(2)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
});
