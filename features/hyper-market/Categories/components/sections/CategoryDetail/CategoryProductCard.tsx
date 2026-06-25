"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";

interface Props {
    product: CategoryProduct;
}

export const CategoryProductCard = memo(function CategoryProductCard({ product }: Props) {
    const [imgError, setImgError] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const showImage = !imgError && !!product.full_image_url;
    const discountPercent = product.discount_percentage ?? 0;

    return (
        <Link
            href={`/items/${product.id}?module_id=3`}
            dir="rtl"
            aria-label={product.name}
            className={[
                "group relative flex h-full flex-col overflow-hidden rounded-xl bg-white",
                "shadow-[0_2px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.05]",
                "outline-none transition-transform duration-150 active:scale-[0.97]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
        >
            <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#F7F9F7]">
                {hasDiscount && product.discount_percentage != null && (
                    <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        -{Math.round(product.discount_percentage)}%
                    </span>
                )}

                <div className="absolute bottom-1.5 end-1.5 z-10">
                    <ProductAddControl
                        product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            discount: discountPercent,
                        }}
                        isAvailable={true}
                        size="sm"
                    />
                </div>

                {showImage ? (
                    <Image
                        src={product.full_image_url}
                        alt=""
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-active:scale-95"
                        sizes="(max-width: 640px) 30vw, 140px"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-300" aria-hidden />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1 px-2 pb-2.5 pt-1.5">
                <p className="line-clamp-2 min-h-[2.4em] text-right text-[11px] font-semibold leading-snug text-[#111B18] sm:text-xs">
                    {product.name}
                </p>

                <div className="mt-auto flex flex-col items-start gap-0.5">
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-[10px] leading-none text-gray-400 line-through"
                        />
                    )}
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[11px] font-bold leading-none text-[#2F8F3B] sm:text-xs"
                    />
                </div>
            </div>
        </Link>
    );
});
