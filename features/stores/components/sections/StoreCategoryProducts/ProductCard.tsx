"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { StoreProduct } from "@/features/stores/types/store.types";

interface ProductCardProps {
    product: StoreProduct;
    moduleId: string;
}

export const ProductCard = memo(function ProductCard({ product, moduleId }: ProductCardProps) {
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const showImage = !imgError && !!product.full_image_url;
    const discountPercent = product.discount_percentage ?? 0;

    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: discountPercent,
    };

    return (
        <div
            dir="rtl"
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]"
        >
            {/* Product image — right side in RTL */}
            <Link
                href={`/items/${product.id}?module_id=${moduleId}`}
                tabIndex={-1}
                aria-hidden
                className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-[#F6F5F8] outline-none"
            >
                {hasDiscount && discountPercent > 0 && (
                    <span className="absolute end-1 top-1 z-10 rounded-md bg-[#FFDCDC] px-1.5 py-0.5 text-[9px] font-bold leading-none text-[#DB2626]">
                        -{Math.round(discountPercent)}%
                    </span>
                )}
                {showImage ? (
                    <Image
                        src={product.full_image_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="80px"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-7 w-7 text-gray-300" aria-hidden />
                    </div>
                )}
            </Link>

            {/* Text info — center column */}
            <Link
                href={`/items/${product.id}?module_id=${moduleId}`}
                aria-label={product.name}
                className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            >
                <p className="line-clamp-2 text-right text-sm font-bold leading-snug text-[#111B18]">
                    {product.name}
                </p>

                {/* Price row */}
                <div className="mt-2 flex items-center gap-2">
                    <PriceTag
                        amount={displayPrice}
                        size="sm"
                        className="text-[15px] font-bold leading-none text-[#111B18]"
                    />
                    {hasDiscount && (
                        <PriceTag
                            amount={product.price}
                            size="sm"
                            className="text-xs leading-none text-[#CD1625] line-through decoration-[#CD1625]"
                        />
                    )}
                </div>
            </Link>

            {/* Actions — left side: wishlist + add-to-cart */}
            <div className="flex shrink-0 flex-col items-center justify-between self-stretch py-0.5 gap-3">
                <button
                    type="button"
                    aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setWishlisted((p) => !p);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors active:bg-gray-50"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            wishlisted
                                ? "fill-[#30913F] text-[#30913F]"
                                : "fill-none text-gray-700",
                        ].join(" ")}
                        strokeWidth={wishlisted ? 0 : 1.8}
                    />
                </button>

                <ProductAddControl
                    product={cartProduct}
                    isAvailable={true}
                    size="sm"
                    variant="soft"
                    className="h-8 w-8"
                />
            </div>
        </div>
    );
});
