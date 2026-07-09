"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice, PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";

interface Props {
    product: CategoryProduct;
    layout?: "grid" | "list";
}

function SarIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 17 17" fill="none" aria-hidden>
            <path
                d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                fill="currentColor"
            />
        </svg>
    );
}

export const CategoryProductCard = memo(function CategoryProductCard({
    product,
    layout = "grid",
}: Props) {
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistPending, setWishlistPending] = useState(false);

    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const showImage = !imgError && !!product.full_image_url;
    const discountPercent = product.discount_percentage ?? 0;

    const cartProduct = useMemo(
        () => ({
            id: product.id,
            name: product.name,
            price: product.price,
            discount: discountPercent,
        }),
        [product.id, product.name, product.price, discountPercent],
    );

    const itemHref = `/items/${product.id}?module_id=3`;

    async function toggleWishlist(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (wishlistPending) return;

        setWishlistPending(true);
        const wasLiked = wishlisted;
        setWishlisted(!wasLiked);

        const result = wasLiked
            ? await removeFromWishlist({ itemId: product.id })
            : await addToWishlist({ itemId: product.id });

        if (!result.success) setWishlisted(wasLiked);
        setWishlistPending(false);
    }

    const WishlistButton = (
        <button
            type="button"
            aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            aria-pressed={wishlisted}
            onClick={toggleWishlist}
            disabled={wishlistPending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(246,245,248,0.8)] transition-colors active:bg-[#F6F5F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60 dark:bg-gray-800/80 dark:active:bg-gray-700"
        >
            <Heart
                className={[
                    "h-5 w-5 transition-colors",
                    wishlisted
                        ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                        : "fill-none text-[#30913F] dark:text-[#4db860]",
                ].join(" ")}
                strokeWidth={wishlisted ? 0 : 1.5}
                aria-hidden
            />
        </button>
    );

    if (layout === "list") {
        return (
            <div
                dir="rtl"
                className="flex h-full w-full min-w-0 flex-row-reverse items-center gap-2.5 rounded-2xl bg-white px-2.5 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] dark:bg-gray-800 dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] dark:ring-white/[0.06] sm:gap-3 sm:px-4 sm:py-3"
            >
                <div className="flex shrink-0 flex-col items-center justify-between gap-3 self-stretch p-0.5">
                    {WishlistButton}
                    <ProductAddControl
                        product={cartProduct}
                        isAvailable={true}
                        size="sm"
                        variant="soft"
                        className="h-9 w-9"
                    />
                </div>

                <Link
                    href={itemHref}
                    aria-label={product.name}
                    className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                >
                    <p className="line-clamp-2 text-start text-sm font-bold leading-snug text-[#111B18] dark:text-gray-50">
                        {product.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <PriceTag
                            amount={displayPrice}
                            size="sm"
                            className="text-[15px] font-bold leading-none text-[#111B18] dark:text-gray-50"
                        />
                        {hasDiscount && (
                            <PriceTag
                                amount={product.price}
                                size="sm"
                                className="text-xs leading-none text-[#707784] line-through decoration-[#CD1625] dark:text-gray-500"
                            />
                        )}
                    </div>
                </Link>

                <Link
                    href={itemHref}
                    tabIndex={-1}
                    aria-hidden
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F6F5F8] outline-none dark:bg-gray-700 sm:h-20 sm:w-20"
                >
                    {hasDiscount && (
                        <span className="absolute end-0 top-0 z-10 rounded-ss-md rounded-es-md bg-[#FFDCDC] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#DB2626] dark:bg-red-900/40 dark:text-red-300">
                            -{Math.round(discountPercent)}%
                        </span>
                    )}
                    {showImage ? (
                        <Image
                            src={product.full_image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-1.5"
                            sizes="80px"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-7 w-7 text-gray-300 dark:text-gray-600" aria-hidden />
                        </div>
                    )}
                </Link>
            </div>
        );
    }

    return (
        <div
            dir="rtl"
            className="relative flex min-h-[172px] w-full min-w-0 flex-row items-center gap-2 overflow-hidden rounded-lg bg-white shadow-[0_7px_19.8px_rgba(0,0,0,0.04)] dark:bg-gray-800 dark:shadow-[0_7px_19.8px_rgba(0,0,0,0.2)] sm:min-h-[190px]"
        >
            {hasDiscount && (
                <span className="absolute end-0 top-[5px] z-10 flex min-w-[38px] items-center justify-center rounded-ss-md rounded-es-md bg-[#FFDCDC] px-[11px] py-0.5 text-[13px] font-bold leading-[1] text-[#DB2626] dark:bg-red-900/40 dark:text-red-300">
                    -{Math.round(discountPercent)}%
                </span>
            )}

            <Link
                href={itemHref}
                aria-label={product.name}
                className="flex flex-1 flex-col items-end gap-2 self-stretch pb-2 pe-2 pt-2 outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] sm:pe-2.5 sm:pt-2.5"
            >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl p-[5px] sm:h-[60px] sm:w-[60px]">
                    {showImage ? (
                        <div className="relative h-full w-full">
                            <Image
                                src={product.full_image_url}
                                alt={product.name}
                                fill
                                className="object-contain"
                                sizes="60px"
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                        </div>
                    ) : (
                        <ShoppingBag className="h-7 w-7 text-gray-300 dark:text-gray-600" aria-hidden />
                    )}
                </div>

                <div className="flex w-full flex-col items-start justify-between gap-3 px-1 sm:gap-4">
                    <p className="line-clamp-2 w-full text-start text-[13px] font-bold leading-[1.4] text-[#111B18] dark:text-gray-50 sm:text-[14px]">
                        {product.name}
                    </p>

                    <div className="flex items-start gap-1">
                        <span className="inline-flex items-center gap-0.5 text-[15px] font-medium leading-[1.4] text-[#111B18] dark:text-gray-50 sm:text-[16px]">
                            {formatPrice(displayPrice)}
                            <SarIcon size={16} />
                        </span>

                        {hasDiscount && (
                            <span className="relative inline-flex items-center gap-0.5 text-[11px] font-medium leading-[1.2] text-[#707784] dark:text-gray-500 sm:text-[12px]">
                                {formatPrice(product.price)}
                                <SarIcon size={10} />
                                <span
                                    className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#CD1625]"
                                    aria-hidden
                                />
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="flex shrink-0 flex-col items-center justify-between gap-3 self-stretch p-0.5">
                {WishlistButton}
                <ProductAddControl
                    product={cartProduct}
                    isAvailable={true}
                    size="sm"
                    variant="solid"
                    className="h-9 w-9"
                />
            </div>
        </div>
    );
});
