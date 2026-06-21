"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { getDiscountedPrice, hasDiscount } from "@/features/item/types/item.types";
import { RelatedItem } from "@/features/item/types/related-items.types";

interface RelatedProductCardProps {
    product: RelatedItem;
    moduleId?: string;
}

export function RelatedProductCard({ product, moduleId }: RelatedProductCardProps) {
    const [imgErr, setImgErr] = useState(false);
    const discounted = hasDiscount(product.discount);
    const displayPrice = getDiscountedPrice(product.price, product.discount, product.discount_type);
    const href = moduleId ? `/items/${product.id}?module_id=${moduleId}` : `/items/${product.id}`;

    return (
        <Link
            href={href}
            className="relative flex w-[calc((100%-1rem)/3)] max-w-[7.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-transform duration-150 active:scale-[0.97]"
            dir="rtl"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-[#F7F9F7]">
                {discounted && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        -{product.discount}%
                    </span>
                )}

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="إضافة"
                    className="absolute bottom-1.5 end-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#45C553] shadow transition-transform active:scale-90"
                >
                    <Plus className="h-3 w-3 text-white" strokeWidth={3} />
                </button>

                {!imgErr && product.image_full_url ? (
                    <Image
                        src={product.image_full_url}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        sizes="120px"
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center opacity-20">
                        <ShoppingBag className="h-7 w-7 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-0.5 px-2 pb-2.5 pt-1.5">
                <p className="line-clamp-2 min-h-[2.4em] text-right text-[10px] font-medium leading-[1.2] text-gray-800">
                    {product.name}
                </p>
                {product.store_name && (
                    <p className="truncate text-right text-[9px] text-gray-400">{product.store_name}</p>
                )}
                <p
                    className={`h-[11px] text-[9px] leading-none text-gray-400 ${discounted ? "line-through" : "invisible"}`}
                    aria-hidden={!discounted}
                >
                    {discounted ? (
                        <PriceTag amount={product.price} size="sm" />
                    ) : (
                        <span>0.00</span>
                    )}
                </p>
                <PriceTag amount={displayPrice} size="sm" className="text-[10px] font-bold text-[#2F8F3B]" />
            </div>
        </Link>
    );
}
