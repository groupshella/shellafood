"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { RelatedItem } from "@/features/item/types/related-items.types";

interface RelatedProductCardProps {
    product: RelatedItem;
}

export function RelatedProductCard({ product }: RelatedProductCardProps) {
    const [imgErr, setImgErr] = useState(false);
    const discounted = product.discount > 0;
    const displayPrice = discounted
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <Link
            href={`/items/${product.id}`}
            dir="rtl"
            aria-label={product.name}
            className={[
                "flex min-w-0 flex-col overflow-hidden rounded-xl",
                "bg-white dark:bg-gray-800",
                "shadow-[0_2px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.05] dark:ring-white/[0.06]",
                "transition-transform duration-150 active:scale-[0.97]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
            ].join(" ")}
        >
            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-gray-50 dark:bg-gray-700">
                {discounted && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white sm:text-[10px]">
                        -{product.discount}%
                    </span>
                )}

                <div className="absolute bottom-1.5 end-1.5 z-10">
                    <ProductAddControl
                        product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            discount: product.discount,
                        }}
                        isAvailable={product.is_available}
                        size="sm"
                        variant="soft"
                    />
                </div>

                {!imgErr && product.image_full_url ? (
                    <Image
                        src={product.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-2 sm:p-2.5"
                        sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 160px"
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-300 dark:text-gray-500 sm:h-7 sm:w-7" aria-hidden />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-1 px-1.5 pb-2 pt-1.5 sm:px-2 sm:pb-2.5">
                <p className="line-clamp-2 min-h-[2.4em] text-right text-[11px] font-medium leading-snug text-gray-900 dark:text-gray-100 sm:text-xs lg:text-[13px]">
                    {product.name}
                </p>

                <div className="mt-auto flex flex-col gap-0.5">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[11px] font-bold leading-none sm:text-xs"
                    />
                    {discounted && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[10px] leading-none text-gray-400 line-through dark:text-gray-500 sm:text-[11px]"
                        />
                    )}
                </div>
            </div>
        </Link>
    );
}
