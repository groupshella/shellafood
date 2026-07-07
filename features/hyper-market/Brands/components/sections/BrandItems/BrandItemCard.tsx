"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import type { BrandItem } from "@/features/hyper-market/Brands/types/brands.types";

interface BrandItemCardProps {
    item: BrandItem;
}

export const BrandItemCard = memo(function BrandItemCard({ item }: BrandItemCardProps) {
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const hasDiscount = item.discount_percentage > 0 && item.discounted_price < item.price;
    const displayPrice = hasDiscount ? item.discounted_price : item.price;
    const showImage = !imgError && !!item.image_full_url;

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
                    <span className="absolute start-0 top-0 z-10 rounded-br-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        -{Math.round(item.discount_percentage)}%
                    </span>
                )}

                {showImage ? (
                    <Image
                        src={item.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="72px"
                        loading="lazy"
                        onError={() => setImgError(true)}
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
                <p className="line-clamp-2 text-right text-sm font-semibold leading-snug text-[#111B18] dark:text-gray-50 sm:text-[14px]">
                    {item.name}
                </p>

                {item.description && (
                    <p className="mt-0.5 line-clamp-1 text-right text-xs leading-snug text-gray-400 dark:text-gray-500 sm:text-[12px]">
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

            <div className="flex shrink-0 flex-col items-center gap-2">
                <button
                    type="button"
                    aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setWishlisted((prev) => !prev);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBFEEB] transition-colors active:bg-[#DCF5DC] dark:bg-[#30913F]/15 dark:active:bg-[#30913F]/25 sm:h-8 sm:w-8"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            wishlisted
                                ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                                : "fill-none text-gray-400 dark:text-gray-500",
                        ].join(" ")}
                        strokeWidth={wishlisted ? 0 : 1.8}
                    />
                </button>

                <ProductAddControl
                    product={{
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        discount: item.discount_percentage,
                    }}
                    isAvailable={item.available ?? true}
                    size="sm"
                />
            </div>
        </div>
    );
});
