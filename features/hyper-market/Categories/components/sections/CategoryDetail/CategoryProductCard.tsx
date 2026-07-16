"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice, PriceTag } from "@/features/home/components/shared/PriceTag";
import { ProductAddControl } from "@/features/cart/components/shared/ProductAddControl";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";
import { useNotification } from "@/shared/components/NotificationToast";

interface Props {
    product: CategoryProduct;
    layout?: "grid" | "list";
    moduleId?: string;
    /** When omitted (external callers), defaults to Arabic to match app locale default. */
    isArabic?: boolean;
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
    moduleId = "3",
    isArabic = true,
}: Props) {
    const { success, error: notifyError } = useNotification();
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

    const itemHref = `/items/${product.id}?module_id=${moduleId}`;

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

        if (!result.success) {
            setWishlisted(wasLiked);
            notifyError(result.message);
        } else {
            success(result.message);
        }
        setWishlistPending(false);
    }

    const WishlistButton = (
        <button
            type="button"
            aria-label={
                wishlisted
                    ? isArabic
                        ? "إزالة من المفضلة"
                        : "Remove from favorites"
                    : isArabic
                      ? "إضافة إلى المفضلة"
                      : "Add to favorites"
            }
            aria-pressed={wishlisted}
            onClick={toggleWishlist}
            disabled={wishlistPending}
            className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9",
                "bg-background/90 shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-1 ring-border backdrop-blur-sm",
                "transition-colors active:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                "disabled:opacity-60",
            ].join(" ")}
        >
            <Heart
                className={[
                    "h-4 w-4 transition-colors text-brand sm:h-[18px] sm:w-[18px]",
                    wishlisted ? "fill-brand" : "fill-none",
                ].join(" ")}
                strokeWidth={wishlisted ? 0 : 1.5}
                aria-hidden
            />
        </button>
    );

    if (layout === "list") {
        return (
            <div
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : "en"}
                className={[
                    "group flex h-full w-full min-w-0 items-center gap-3 rounded-2xl bg-background p-3",
                    "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]",
                    "ring-1 ring-border",
                    "touch-manipulation",
                    "motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-200",
                    "motion-safe:active:scale-[0.99] active:bg-card",
                    "sm:gap-3.5 sm:p-3.5",
                    "md:hover:-translate-y-px md:hover:shadow-[0_2px_6px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]",
                ].join(" ")}
            >
                <div className="relative shrink-0">
                    <Link
                        href={itemHref}
                        tabIndex={-1}
                        aria-hidden
                        className={[
                            "relative block h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl sm:h-20 sm:w-20 md:h-[5.5rem] md:w-[5.5rem]",
                            "bg-card ring-1 ring-border",
                            "shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                        ].join(" ")}
                    >
                        {hasDiscount && (
                            <span className="absolute start-1 top-1 z-10 rounded-md bg-[#FFDCDC] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#DB2626] sm:text-[11px]">
                                -{Math.round(discountPercent)}%
                            </span>
                        )}
                        {showImage ? (
                            <Image
                                src={product.full_image_url}
                                alt={product.name}
                                fill
                                className={[
                                    "object-contain p-2 sm:p-2.5",
                                    "motion-safe:transition-transform motion-safe:duration-200",
                                    "md:group-hover:scale-[1.03]",
                                ].join(" ")}
                                sizes="(max-width: 640px) 72px, 88px"
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-card">
                                <ShoppingBag
                                    className="h-7 w-7 text-muted sm:h-8 sm:w-8"
                                    aria-hidden
                                />
                            </div>
                        )}
                    </Link>

                    <div className="absolute -start-1.5 -top-1.5 z-20 sm:-start-2 sm:-top-2">
                        {WishlistButton}
                    </div>
                </div>

                <Link
                    href={itemHref}
                    aria-label={product.name}
                    className={[
                        "flex min-h-11 min-w-0 flex-1 flex-col justify-center py-0.5",
                        "outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    ].join(" ")}
                >
                    <p className="line-clamp-2 text-start text-sm font-bold leading-snug text-foreground sm:text-[15px] sm:leading-snug">
                        {product.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:mt-2">
                        <PriceTag
                            amount={displayPrice}
                            size="sm"
                            className="text-[15px] font-bold leading-none text-foreground sm:text-base"
                        />
                        {hasDiscount && (
                            <PriceTag
                                amount={product.price}
                                size="sm"
                                className="text-[11px] leading-none text-muted line-through decoration-[#CD1625] sm:text-xs"
                            />
                        )}
                    </div>
                </Link>

                <div className="flex shrink-0 self-center">
                    <ProductAddControl
                        product={cartProduct}
                        isAvailable={true}
                        size="sm"
                        variant="soft"
                        className="h-10 w-10 sm:h-11 sm:w-11"
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl bg-background shadow-[0_2px_10px_rgba(0,0,0,0.05)] ring-1 ring-border transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        >
            <Link
                href={itemHref}
                aria-label={product.name}
                className="relative block aspect-square w-full shrink-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
            >
                {hasDiscount && (
                    <span className="absolute start-2 top-2 z-10 flex items-center justify-center rounded-md bg-[#FFDCDC] px-2 py-1 text-[12px] font-bold leading-none text-[#DB2626]">
                        {Math.round(discountPercent)}%-
                    </span>
                )}

                <div className="absolute end-2 top-2 z-10">{WishlistButton}</div>

                {showImage ? (
                    <Image
                        src={product.full_image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04] sm:p-5"
                        sizes="(max-width: 480px) 44vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 200px"
                        quality={90}
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-muted" aria-hidden />
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-2.5 p-2.5 sm:p-3">
                <Link
                    href={itemHref}
                    aria-label={product.name}
                    className="outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                    <p className="line-clamp-2 min-h-[2.5em] text-start text-[13px] font-bold leading-[1.4] text-foreground sm:text-[14px]">
                        {product.name}
                    </p>
                </Link>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col items-start gap-0.5">
                        <span className="inline-flex items-center gap-0.5 text-[15px] font-bold leading-[1.2] text-foreground sm:text-[16px]">
                            {formatPrice(displayPrice)}
                            <SarIcon size={16} />
                        </span>

                        {hasDiscount && (
                            <span className="relative inline-flex items-center gap-0.5 text-[11px] font-medium leading-[1.2] text-muted sm:text-[12px]">
                                {formatPrice(product.price)}
                                <SarIcon size={10} />
                                <span
                                    className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#CD1625]"
                                    aria-hidden
                                />
                            </span>
                        )}
                    </div>

                    <ProductAddControl
                        product={cartProduct}
                        isAvailable={true}
                        size="sm"
                        variant="solid"
                        className="h-9 w-9 shrink-0"
                    />
                </div>
            </div>
        </div>
    );
});
