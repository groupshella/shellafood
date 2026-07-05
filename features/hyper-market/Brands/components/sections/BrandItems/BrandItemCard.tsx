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
            className="flex items-center gap-3 bg-white px-4 py-3"
        >
            {/* ── RIGHT — product image (navigates) ── */}
            <Link
                href={`/items/${item.id}?module_id=3`}
                aria-label={item.name}
                className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#F6F5F8] outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                tabIndex={-1}
            >
                {/* Discount badge */}
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
                        <ShoppingBag className="h-7 w-7 text-gray-300" aria-hidden />
                    </div>
                )}
            </Link>

            {/* ── CENTER — text block (navigates) ── */}
            <Link
                href={`/items/${item.id}?module_id=3`}
                aria-label={item.name}
                className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            >
                <p className="line-clamp-2 text-right text-[14px] font-semibold leading-snug text-[#111B18]">
                    {item.name}
                </p>

                {item.description && (
                    <p className="mt-0.5 text-right text-[12px] leading-snug text-gray-400">
                        {item.description}
                    </p>
                )}

                {/* Price row */}
                <div className="mt-1.5 flex items-center gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[13px] font-bold leading-none text-[#2F8F3B]"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={item.price}
                            size="sm"
                            className="text-[11px] leading-none text-gray-300 line-through"
                        />
                    )}
                </div>
            </Link>

            {/* ── LEFT — action buttons (do NOT navigate) ── */}
            <div className="flex shrink-0 flex-col items-center gap-2">
                {/* Heart / wishlist toggle */}
                <button
                    type="button"
                    aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setWishlisted((prev) => !prev);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBFEEB] transition-colors active:bg-[#DCF5DC]"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            wishlisted
                                ? "fill-[#30913F] text-[#30913F]"
                                : "fill-none text-gray-400",
                        ].join(" ")}
                        strokeWidth={wishlisted ? 0 : 1.8}
                    />
                </button>

                {/* Add to cart */}
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