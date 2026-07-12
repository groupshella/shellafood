"use client";

import { Heart, Plus } from "lucide-react";
import Image from "next/image";

import { useLanguage } from "@/features/language/useLanguage";
import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsProduct } from "@/features/profile/types/statistics.types";

export function GridProductCard({
    product,
    favorited,
    pulsing,
    onToggleHeart,
}: {
    product: StatisticsProduct;
    favorited: boolean;
    pulsing: boolean;
    onToggleHeart: () => void;
}) {
    const { isArabic } = useLanguage();

    return (
        <article className="relative rounded-[8px] bg-white dark:bg-gray-800 p-3 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95">
            <button
                type="button"
                aria-label={
                    favorited
                        ? isArabic
                            ? "إزالة من المفضلة"
                            : "Remove from favorites"
                        : isArabic
                          ? "إضافة إلى المفضلة"
                          : "Add to favorites"
                }
                onClick={onToggleHeart}
                className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center"
            >
                <span
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm dark:bg-gray-700/90 transition-transform duration-200",
                        pulsing ? "scale-[1.15]" : "scale-100",
                    ].join(" ")}
                >
                    <Heart
                        className={[
                            "h-[18px] w-[18px] transition-[fill,color] duration-200",
                            favorited
                                ? "fill-[#30913F] text-[#30913F]"
                                : "fill-none text-[#707784] dark:text-gray-400",
                        ].join(" ")}
                        strokeWidth={favorited ? 0 : 1.5}
                    />
                </span>
            </button>
            {product.discountPercent != null && (
                <span className="absolute start-3 top-3 rounded bg-[#FFDCDC] px-1.5 py-0.5 text-[12px] font-bold text-[#DB2626]">
                    -{product.discountPercent}%
                </span>
            )}
            <div className="mx-auto flex h-[100px] w-full items-center justify-center">
                <Image
                    src={product.imageUrl}
                    alt=""
                    width={100}
                    height={100}
                    unoptimized={product.imageUrl.startsWith("data:")}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="mt-2 text-end">
                <p
                    className="line-clamp-2 text-[14px] font-bold text-[#111B18] dark:text-gray-100"
                    style={TAJAWAL}
                >
                    {product.title}
                </p>
                <p className="text-[12px] text-[#707784] dark:text-gray-500" style={TAJAWAL}>
                    {product.weight}
                </p>
            </div>
            <div className="mt-2 flex items-end justify-between">
                <div className="text-end">
                    {product.oldPrice && (
                        <p
                            className="text-[12px] text-[#707784] dark:text-gray-500 line-through"
                            style={TAJAWAL}
                        >
                            {product.oldPrice}
                        </p>
                    )}
                    <p
                        className="text-[16px] font-bold text-[#111B18] dark:text-gray-100"
                        style={TAJAWAL}
                    >
                        {product.currentPrice}
                    </p>
                </div>
                <button
                    type="button"
                    aria-label={isArabic ? "إضافة إلى السلة" : "Add to cart"}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#30913F] active:scale-[0.92]"
                >
                    <Plus className="h-4 w-4 text-white" strokeWidth={2} />
                </button>
            </div>
        </article>
    );
}
