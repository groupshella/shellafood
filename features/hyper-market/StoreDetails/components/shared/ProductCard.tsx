"use client";

import Image from "@/shared/components/SecureImage";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";

interface ProductCardProps {
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
    isArabic?: boolean;
}

export const ProductCard = memo(function ProductCard({
    productId,
    name,
    imageUrl,
    price,
    originalPrice,
    isArabic = true,
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
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-card shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
        >
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-xl bg-background">
                <Link
                    href={`/items/${productId}`}
                    className="absolute inset-0 outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={name}
                >
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
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
                <p className="line-clamp-2 text-start text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
                    {name}
                </p>
                <div className="mt-auto flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                        {price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-[10px] text-muted line-through">
                            {originalPrice!.toFixed(2)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
});
