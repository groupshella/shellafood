"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useItemDetails } from "@/features/item/hooks/useItemDetails";
import {
    getDiscountedPrice,
    getItemImages,
    hasDiscount,
} from "@/features/item/types/item.types";
import { RelatedItem } from "@/features/item/types/related-items.types";

const PAGE_BG = "min-h-screen bg-[#F5F5F5]";

const H_SCROLL_TRACK = [
    "flex gap-2 overflow-x-auto",
    "snap-x scroll-smooth",
    "scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
].join(" ");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number) {
    return `${value.toFixed(2)} ﷼`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ItemPageSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square w-full bg-gray-200" />
            <div className="space-y-3 bg-white px-4 py-4">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="h-6 w-1/4 rounded bg-gray-200" />
            </div>
            <div className="mt-2 bg-white px-4 py-4">
                <div className="mb-3 h-4 w-32 rounded bg-gray-200" />
                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-36 w-28 shrink-0 rounded-xl bg-gray-100" />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Image gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images, name }: { images: string[]; name: string }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

    const activeUrl = images[activeIndex];
    const showThumbs = images.length > 1;

    return (
        <div className="bg-white">
            <div className="relative aspect-square w-full overflow-hidden bg-[#F7F9F7]">
                {!imgErrors[activeIndex] && activeUrl ? (
                    <Image
                        src={activeUrl}
                        alt={name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 480px"
                        priority
                        onError={() =>
                            setImgErrors((prev) => ({ ...prev, [activeIndex]: true }))
                        }
                    />
                ) : (
                    <div className="flex h-full items-center justify-center opacity-20">
                        <ShoppingBag className="h-16 w-16 text-gray-400" />
                    </div>
                )}
            </div>

            {showThumbs && (
                <div className={`${H_SCROLL_TRACK} px-4 py-3`} dir="ltr">
                    {images.map((url, index) => (
                        <button
                            key={`${url}-${index}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={[
                                "relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded-lg border-2 bg-[#F7F9F7] transition-colors",
                                index === activeIndex
                                    ? "border-[#45C553]"
                                    : "border-transparent",
                            ].join(" ")}
                            aria-label={`صورة ${index + 1}`}
                        >
                            {!imgErrors[index] ? (
                                <Image
                                    src={url}
                                    alt=""
                                    fill
                                    className="object-contain p-1"
                                    sizes="56px"
                                    onError={() =>
                                        setImgErrors((prev) => ({ ...prev, [index]: true }))
                                    }
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center opacity-30">
                                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Related product card ─────────────────────────────────────────────────────

function RelatedProductCard({ product }: { product: RelatedItem }) {
    const [imgErr, setImgErr] = useState(false);
    const discounted = hasDiscount(product.discount);
    const displayPrice = getDiscountedPrice(
        product.price,
        product.discount,
        product.discount_type,
    );

    return (
        <Link
            href={`/items/${product.id}`}
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
                    <p className="truncate text-right text-[9px] text-gray-400">
                        {product.store_name}
                    </p>
                )}
                <p
                    className={`h-[11px] text-[9px] leading-none text-gray-400 ${discounted ? "line-through" : "invisible"}`}
                    aria-hidden={!discounted}
                >
                    {discounted ? formatPrice(product.price) : "0.00 ﷼"}
                </p>
                <span className="text-[10px] font-bold text-[#2F8F3B]">
                    {formatPrice(displayPrice)}
                </span>
            </div>
        </Link>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface ItemPageProps {
    itemId: string;
    moduleId: string;
}

export default function ItemPage({ itemId, moduleId }: ItemPageProps) {
    const router = useRouter();
    const { item, relatedItems, isLoading, isLoadingRelated, error } = useItemDetails(itemId, moduleId);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
    }, [itemId]);

    if (isLoading) {
        return (
            <div className={PAGE_BG} dir="rtl">
                <header className="flex items-center gap-3 bg-white px-4 pb-3 pt-4">
                    <div className="h-9 w-9 rounded-full bg-gray-100" />
                    <div className="mx-auto h-4 w-24 rounded bg-gray-100" />
                    <div className="h-9 w-9" />
                </header>
                <ItemPageSkeleton />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div
                className={`${PAGE_BG} flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center`}
                dir="rtl"
            >
                <p className="text-sm text-gray-500">{error ?? "المنتج غير متوفر"}</p>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-semibold text-[#2F8F3B] underline"
                >
                    العودة
                </button>
            </div>
        );
    }

    const images = getItemImages(item);
    const discounted = hasDiscount(item.discount);
    const displayPrice = getDiscountedPrice(item.price, item.discount, item.discount_type);
    const inStock = item.stock > 0;
    const showRating = item.rating_count > 0;

    return (
        <div className={PAGE_BG} dir="rtl">
            {/* Header */}
            <header className="flex items-center gap-3 bg-white px-4 pb-3 pt-4 sm:px-5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F0F0] transition-transform active:scale-90"
                    aria-label="رجوع"
                >
                    <ArrowRight className="h-4 w-4 text-gray-700" strokeWidth={2} />
                </button>
                <h1 className="flex-1 truncate text-center text-sm font-bold text-gray-900">
                    {item.name}
                </h1>
                <div className="h-9 w-9" aria-hidden />
            </header>

            {/* Gallery */}
            <ImageGallery images={images} name={item.name} />

            {/* Product info */}
            <div className="mt-0.5 bg-white px-4 py-4 sm:px-5">
                <h2 className="text-base font-bold leading-snug text-gray-900">{item.name}</h2>

                {item.store_name && (
                    <p className="mt-1 text-xs text-gray-500">{item.store_name}</p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {showRating && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#DFF5E3] px-2 py-1 text-xs font-bold text-gray-900">
                            {item.avg_rating.toFixed(1)}
                            <Star
                                className="h-3 w-3 fill-[#45C553] text-[#45C553]"
                                strokeWidth={0}
                            />
                            <span className="font-normal text-gray-500">
                                ({item.rating_count})
                            </span>
                        </span>
                    )}

                    <span
                        className={[
                            "rounded-lg px-2 py-1 text-xs font-semibold",
                            inStock
                                ? "bg-[#E8F8E8] text-[#2F8F3B]"
                                : "bg-red-50 text-red-600",
                        ].join(" ")}
                    >
                        {inStock ? "متوفر" : "غير متوفر"}
                    </span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                    {discounted && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.price)}
                        </span>
                    )}
                    <span className="text-xl font-bold text-[#2F8F3B]">
                        {formatPrice(displayPrice)}
                    </span>
                    {discounted && (
                        <span className="mb-0.5 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            -{item.discount}%
                        </span>
                    )}
                </div>

                {item.description?.trim() && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <h3 className="mb-2 text-sm font-bold text-gray-900">الوصف</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                )}
            </div>

            {/* Quantity + add to cart */}
            <div className="sticky bottom-0 mt-2 border-t border-gray-100 bg-white px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 py-1">
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
                            aria-label="تقليل الكمية"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-bold text-gray-900">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
                            aria-label="زيادة الكمية"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <button
                        type="button"
                        disabled={!inStock}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#45C553] py-3 text-sm font-bold text-white transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        إضافة للسلة
                    </button>
                </div>
            </div>

            {/* Related items */}
            {(isLoadingRelated || relatedItems.length > 0) && (
                <section className="mt-2 bg-white pb-8 pt-4">
                    <h2 className="px-4 pb-3 text-sm font-bold text-gray-900 sm:px-5">
                        منتجات قد تعجبك
                    </h2>

                    {isLoadingRelated ? (
                        <div className="flex gap-2 px-4 sm:px-5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-36 w-28 shrink-0 animate-pulse rounded-xl bg-gray-100"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={`${H_SCROLL_TRACK} px-4 sm:px-5`} dir="ltr">
                            {relatedItems.map((product) => (
                                <RelatedProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
