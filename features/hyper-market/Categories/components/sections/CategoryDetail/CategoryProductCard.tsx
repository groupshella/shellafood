"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";

interface Props {
    product: CategoryProduct;
}

/**
 * Vertical product card — matches the CategoriesPage spec exactly:
 *
 *  ┌─────────────┐
 *  │  [img 66px] │  ← discount badge top-start, add btn bottom-start
 *  │  name 2-ln  │
 *  │  price  ر.س │  ← original strikethrough above if discounted
 *  └─────────────┘
 */
export const CategoryProductCard = memo(function CategoryProductCard({ product }: Props) {
    const [imgError, setImgError] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;

    return (
        <Link
            href={`/items/${product.id}?module_id=3`}
            dir="rtl"
            aria-label={product.name}
            className="group relative flex flex-col overflow-hidden rounded-[6px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-transform active:scale-[0.97]"
        >
            {/* ── Image area ── */}
            <div className="relative mx-auto mt-2 flex h-[66px] w-[66px] items-center justify-center">
                {/* Discount badge — top-start */}
                {hasDiscount && product.discount_percentage != null && (
                    <span className="absolute start-0 top-0 z-10 rounded bg-[#FFDCDC] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#DB2626]">
                        -{product.discount_percentage}%
                    </span>
                )}

                {/* Add to cart — bottom-start */}
                <button
                    type="button"
                    aria-label="إضافة إلى السلة"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: cart action
                    }}
                    className="absolute bottom-0 start-0 z-10 flex h-[26px] w-[26px] items-center justify-center rounded-[13px] bg-[#D1FDD2] transition-transform active:scale-90"
                >
                    <Plus className="h-3.5 w-3.5 text-[#30913F]" strokeWidth={2} />
                </button>

                {/* Product image */}
                {!imgError && product.full_image_url ? (
                    <Image
                        src={product.full_image_url}
                        alt=""
                        width={66}
                        height={66}
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <ShoppingBag className="h-8 w-8 text-[#707784] opacity-15" />
                )}
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 flex-col justify-between px-2 pb-2 pt-1">
                {/* Name */}
                <p className="line-clamp-2 min-h-[2.6em] text-right text-[10px] font-medium leading-[1.3] text-[#111B18]">
                    {product.name}
                </p>

                {/* Price */}
                <div className="mt-1 flex flex-col items-end">
                    {hasDiscount && (
                        <span className="text-[9px] text-[#CD1625] line-through">
                            {product.price.toFixed(2)} ر.س
                        </span>
                    )}
                    <span className="text-[13px] font-bold text-black">
                        {displayPrice.toFixed(2)}{" "}
                        <span className="text-[10px] font-normal text-[#555]">ر.س</span>
                    </span>
                </div>
            </div>
        </Link>
    );
});