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
                "flex flex-col overflow-hidden rounded-xl bg-white",
                "shadow-[0_2px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.05]",
                "transition-transform duration-150 active:scale-[0.97]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
        >
            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-[#F7F9F7]">
                {discounted && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
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
                    />
                </div>

                {!imgErr && product.image_full_url ? (
                    <Image
                        src={product.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 30vw, 140px"
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-7 w-7 text-gray-200" aria-hidden />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-1 px-2 pb-2.5 pt-1.5">
                <p className="line-clamp-2 min-h-[2.4em] text-right text-[11px] font-medium leading-snug text-[#111B18]">
                    {product.name}
                </p>

                <div className="mt-auto flex flex-col items-end gap-0.5">
                    {discounted && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[10px] leading-none text-gray-400 line-through"
                        />
                    )}
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[11px] font-bold leading-none text-[#2F8F3B]"
                    />
                </div>
            </div>
        </Link>
    );
}
