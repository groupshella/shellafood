"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";

interface CategoryProductCardProps {
    product: CategoryProduct;
}

export function CategoryProductCard({ product }: CategoryProductCardProps) {
    const [imgErr, setImgErr] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;

    return (
        <Link
            href={`/items/${product.id}?module_id=3`}
            className="group relative flex flex-col overflow-hidden rounded-[6px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-transform active:scale-[0.97]"
            aria-label={product.name}
            dir="rtl"
        >
            <div className="relative mx-auto mt-2 flex h-[66px] w-[66px] items-center justify-center">
                {hasDiscount && product.discount_percentage != null && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded bg-[#FFDCDC] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#DB2626]">
                        -{product.discount_percentage}%
                    </span>
                )}

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="إضافة إلى السلة"
                    className="absolute bottom-1.5 start-1.5 z-10 flex h-[26px] w-[26px] items-center justify-center rounded-[13px] bg-[#D1FDD2] transition-transform active:scale-90"
                >
                    <Plus className="h-3.5 w-3.5 text-[#30913F]" strokeWidth={2} />
                </button>

                {!imgErr && product.full_image_url ? (
                    <Image
                        src={product.full_image_url}
                        alt=""
                        width={66}
                        height={66}
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <ShoppingBag className="h-8 w-8 text-[#707784] opacity-15" />
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between px-2 pb-2 pt-1">
                <p className="line-clamp-2 min-h-[2.6em] text-right text-[10px] font-medium leading-[1.3] text-[#111B18]">
                    {product.name}
                </p>
                <div className="mt-1 flex flex-col items-end">
                    {hasDiscount && (
                        <span className="text-[9px] text-[#CD1625] line-through">
                            {product.price.toFixed(2)} ر
                        </span>
                    )}
                    <span className="text-[13px] font-bold text-black">
                        {displayPrice.toFixed(2)}{" "}
                        <span className="text-[10px] font-normal">﷼</span>
                    </span>
                </div>
            </div>
        </Link>
    );
}
