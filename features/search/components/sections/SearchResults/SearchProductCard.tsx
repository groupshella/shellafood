"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { SearchProduct } from "@/features/search/types/search.types";

interface SearchProductCardProps {
    product: SearchProduct;
}

export function SearchProductCard({ product }: SearchProductCardProps) {
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

    return (
        <Link
            href={`/items/${product.id}?module_id=${product.module_id}`}
            dir="rtl"
            aria-label={product.name}
            className={[
                "relative flex flex-col overflow-hidden rounded-2xl bg-white",
                "border border-[#E8E8E8]",
                "transition-transform duration-150 active:scale-[0.97]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
        >
            <div className="relative px-3 pb-2 pt-3">
                {discountPercent > 0 && (
                    <span className="absolute start-2 top-2 z-10 rounded-md bg-[#FFEAEA] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#E53935]">
                        {discountPercent}%-
                    </span>
                )}

                <div className="relative mx-auto aspect-square w-full">
                    {!imgErr && product.image_full_url ? (
                        <Image
                            src={product.image_full_url}
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="(max-width: 640px) 45vw, 180px"
                            loading="lazy"
                            onError={() => setImgErr(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-200" aria-hidden />
                        </div>
                    )}
                </div>

                <div className="absolute end-2 top-1/2 z-10 -translate-y-1/4">
                    <ProductAddControl
                        product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            discount: discountPercent,
                        }}
                        isAvailable={isAvailable}
                        size="sm"
                        variant="soft"
                        className="h-9 w-9"
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
                <p className="line-clamp-2 min-h-[2.6em] text-right text-[13px] font-bold leading-snug text-[#111B18]">
                    {product.name}
                </p>

                <div className="mt-auto flex items-center justify-start gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[15px] font-bold leading-none text-[#111B18]"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[12px] leading-none text-gray-400 line-through decoration-[#E53935]"
                        />
                    )}
                </div>
            </div>
        </Link>
    );
}
