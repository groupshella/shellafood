"use client";

import Link from "next/link";
import { Cairo } from "next/font/google";
import { HyperMarketOffer } from "@/features/hyper-market/StoreDetails/types/offers.types";

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    weight: ["500", "600", "700", "900"],
});

function TagIcon() {
    return (
        <svg
            className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
        >
            <path
                d="M2.1 6.8 5.2 9.9c.3.3.8.3 1.1 0l3.6-3.6c.2-.2.3-.4.3-.7V2.8c0-.5-.4-.9-.9-.9H6.4c-.3 0-.5.1-.7.3L2.1 5.7c-.3.3-.3.8 0 1.1Z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
            />
            <circle cx="7.6" cy="4.2" r="0.85" fill="currentColor" />
        </svg>
    );
}

function CtaArrowIcon({ isArabic }: { isArabic: boolean }) {
    return (
        <svg
            viewBox="0 0 10 10"
            fill="none"
            className={[
                "h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4",
                isArabic ? "-scale-x-100" : "",
            ].join(" ")}
            aria-hidden
        >
            <path
                d="M3 2.5 7 5 3 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function formatItemsCount(count: number): string {
    return count.toLocaleString("en-US");
}

export function OfferSlide({
    offer,
    isArabic,
}: {
    offer: HyperMarketOffer;
    priority?: boolean;
    isArabic: boolean;
}) {
    const percent = Math.max(0, Math.round(offer.discount_max || offer.discount_min || 0));
    const itemsLabel =
        offer.items_count > 0
            ? isArabic
                ? `أكثر من ${formatItemsCount(offer.items_count)} منتج ضمن العروض`
                : `Over ${formatItemsCount(offer.items_count)} products on offer`
            : isArabic
                ? "على آلاف المنتجات المختارة"
                : "On thousands of selected products";

    return (
        <Link
            href={`/offers/${offer.id}?module_id=${offer.module_id}`}
            className={[
                cairo.className,
                "group relative block w-full overflow-hidden",
                "aspect-[343/148] sm:aspect-[680/168] md:aspect-[900/200] lg:aspect-[1100/230] xl:aspect-[1280/260] 2xl:aspect-[1536/300]",
                "rounded-2xl sm:rounded-[1.25rem] md:rounded-3xl lg:rounded-[1.75rem] xl:rounded-[2rem]",
                "bg-card shadow-[0_2px_10px_rgba(120,97,166,0.08)]",
                "ring-1 ring-[#E8E0F5]/70",
                "transition-transform duration-200 active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            ].join(" ")}
            aria-label={
                offer.name ||
                (isArabic
                    ? `خصومات حصرية حتى ${percent}%`
                    : `Exclusive discounts up to ${percent}%`)
            }
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -left-4 -top-4 size-14 rounded-full bg-[#DFD3F5]/55 sm:-left-5 sm:-top-5 sm:size-16 md:size-[4.5rem] lg:-left-6 lg:-top-6 lg:size-20 xl:size-24"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-1 left-10 size-9 rounded-full bg-[#3EC856]/[0.08] sm:left-7 sm:size-11 md:left-14 md:size-12 lg:left-16 lg:size-14 xl:left-20 xl:size-16"
            />

            <div
                aria-hidden
                className={[
                    "pointer-events-none absolute -right-[6%] top-0",
                    "flex h-full aspect-square items-center justify-center rounded-full",
                    "bg-[linear-gradient(145deg,#3EC856_6%,#30913F_59%,#22702E_94%)]",
                    "shadow-[0_5px_20px_rgba(48,145,63,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]",
                ].join(" ")}
                dir={isArabic ? "rtl" : "ltr"}
            >
                <div className="absolute inset-[7%] rounded-full border border-white/20" />

                <span className="absolute -top-0.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-[#DFD3F5]/45 bg-[#7861A6]/90 px-2 py-0.5 text-[0.5rem] font-bold tracking-wide text-white shadow-sm sm:top-0 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[0.5625rem] md:px-3 md:py-1 md:text-[0.625rem] lg:gap-1.5 lg:px-3.5 lg:py-1.5 lg:text-[0.6875rem] xl:text-xs">
                    <TagIcon />
                    {isArabic ? "خصم حصري" : "Exclusive deal"}
                </span>

                <div className="relative z-10 flex flex-col items-center text-center text-white">
                    <span className="text-[0.625rem] font-semibold tracking-wide text-white/90 sm:text-[0.6875rem] md:text-xs lg:text-[0.8125rem] xl:text-sm">
                        {isArabic ? "خصم حتى" : "Up to"}
                    </span>
                    <span className="text-[2rem] font-black leading-none tracking-tight sm:text-[2.35rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] 2xl:text-6xl">
                        {percent}%
                    </span>
                    <span className="text-[0.5625rem] font-medium text-white/85 sm:text-[0.625rem] md:text-[0.6875rem] lg:text-xs xl:text-[0.8125rem]">
                        {isArabic ? "لفترة محدودة" : "Limited time"}
                    </span>
                </div>
            </div>

            <div
                lang={isArabic ? "ar" : "en"}
                className={`absolute inset-y-0 ${isArabic ? "end-0" : "start-0"} z-10 flex w-[58%] flex-col justify-between px-3.5 py-3.5 sm:w-[56%] sm:px-4 sm:py-4 md:w-[55%] md:px-5 md:py-5 lg:w-[54%] lg:px-6 lg:py-6 xl:w-[52%] xl:px-8 xl:py-7 2xl:px-10 2xl:py-8`}
            >
                <div className="flex flex-col gap-1 text-start sm:gap-1.5 md:gap-2 lg:gap-2.5">
                    <h3 className="text-[0.8125rem] font-bold leading-snug text-foreground sm:text-[0.9375rem] md:text-base lg:text-lg xl:text-xl 2xl:text-[1.375rem]">
                        {isArabic
                            ? `خصومات حصرية حتى ${percent}%`
                            : `Exclusive discounts up to ${percent}%`}
                    </h3>
                    <p className="text-[0.6875rem] font-medium leading-snug text-muted sm:text-xs md:text-[0.8125rem] lg:text-sm xl:text-[0.9375rem]">
                        {isArabic
                            ? "على آلاف المنتجات المختارة"
                            : "On thousands of selected products"}
                    </p>
                    <p className="mt-0.5 text-[0.6875rem] font-semibold leading-snug text-brand sm:text-xs md:text-[0.8125rem] lg:mt-1 lg:text-sm xl:text-[0.9375rem]">
                        • {itemsLabel}
                    </p>
                </div>

                <span className="inline-flex min-h-8 w-fit items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-[0.625rem] font-bold text-brand-foreground transition-colors group-hover:brightness-95 sm:min-h-9 sm:rounded-lg sm:px-3.5 sm:py-2 sm:text-[0.6875rem] md:min-h-10 md:gap-2 md:px-4 md:py-2.5 md:text-xs lg:min-h-11 lg:rounded-xl lg:px-5 lg:py-3 lg:text-sm xl:min-h-12 xl:px-6 xl:text-[0.9375rem]">
                    {isArabic ? "استكشف العروض" : "Explore offers"}
                    <CtaArrowIcon isArabic={isArabic} />
                </span>
            </div>
        </Link>
    );
}
