import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ChevronLeft, Clock, Star, Store as StoreIcon, Truck } from "lucide-react";
import { Store } from "@/features/markets/types/stores.types";

const CARD_CLASSES = [
    "group flex h-full min-w-0 items-center gap-3 rounded-2xl bg-white p-3",
    "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]",
    "ring-1 ring-black/[0.05]",
    "dark:bg-gray-800 dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.14)]",
    "dark:ring-white/[0.06]",
    "touch-manipulation",
    "motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-200",
    "active:scale-[0.98] active:bg-gray-50/90 dark:active:bg-gray-700/60",
    "sm:gap-3.5 sm:p-3.5",
    "md:hover:-translate-y-px md:hover:shadow-[0_2px_6px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]",
    "md:dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.2)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-gray-950",
].join(" ");

const CHIP_BASE =
    "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium leading-none sm:h-[26px] sm:px-3 sm:text-xs";

function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} م`;
    return `${(meters / 1000).toFixed(1)} كم`;
}

function storeSubtitle(store: Store): string {
    if (store.delivery_time) return `توصيل خلال ${store.delivery_time}`;
    if (store.distance > 0) return `يبعد ${formatDistance(store.distance)}`;
    return "متجر متاح للطلب";
}

export const StoreCard = memo(function StoreCard({ store }: { store: Store }) {
    return (
        <Link
            href={`/stores/${store.id}?module_id=${store.module_id}`}
            className={CARD_CLASSES}
            dir="rtl"
            aria-label={store.name}
        >
            {/* Logo */}
            <div
                className={[
                    "relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-2xl",
                    "bg-gray-100 ring-1 ring-black/[0.06]",
                    "shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                    "dark:bg-gray-700 dark:ring-white/[0.08] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
                    "sm:h-[68px] sm:w-[68px]",
                ].join(" ")}
            >
                {store.logo_full_url ? (
                    <Image
                        src={store.logo_full_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 60px, 68px"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className={[
                            "flex h-full w-full items-center justify-center",
                            "bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]",
                            "dark:from-[#30913F]/25 dark:to-[#30913F]/10",
                        ].join(" ")}
                        aria-hidden
                    >
                        <StoreIcon
                            className="h-7 w-7 text-[#30913F]/50 dark:text-[#4db860]/45 sm:h-8 sm:w-8"
                            strokeWidth={1.4}
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                {/* Name + status */}
                <div className="flex items-start justify-between gap-2">
                    <h3
                        className={[
                            "line-clamp-2 min-w-0 flex-1 text-start",
                            "text-[15px] font-bold leading-snug tracking-tight",
                            "text-gray-900 dark:text-gray-50",
                            "sm:text-base",
                        ].join(" ")}
                    >
                        {store.name}
                    </h3>
                    <span
                        role="status"
                        aria-label={store.is_open ? "مفتوح" : "مغلق"}
                        className={[
                            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5",
                            "text-[10px] font-semibold leading-none sm:px-2.5 sm:text-[11px]",
                            store.is_open
                                ? "bg-green-50 text-green-700 dark:bg-green-900/35 dark:text-green-300"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
                        ].join(" ")}
                    >
                        <span
                            aria-hidden
                            className={[
                                "h-1.5 w-1.5 rounded-full",
                                store.is_open
                                    ? "bg-green-500 dark:bg-green-400"
                                    : "bg-gray-400 dark:bg-gray-500",
                            ].join(" ")}
                        />
                        {store.is_open ? "مفتوح" : "مغلق"}
                    </span>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400 sm:gap-x-3 sm:text-xs">
                    {store.avg_rating > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                            <Star
                                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                strokeWidth={0}
                                aria-hidden
                            />
                            {store.avg_rating.toFixed(1)}
                        </span>
                    )}
                    <span className="inline-flex min-w-0 items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="truncate">{storeSubtitle(store)}</span>
                    </span>
                </div>

                {/* Chips */}
                {(store.free_delivery || store.has_offer) && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {store.free_delivery && (
                            <span
                                className={[
                                    CHIP_BASE,
                                    "bg-[#E8F5E9] text-green-700",
                                    "dark:bg-green-900/30 dark:text-green-300",
                                ].join(" ")}
                            >
                                <Truck className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                                توصيل مجاني
                            </span>
                        )}
                        {store.has_offer && (
                            <span
                                className={[
                                    CHIP_BASE,
                                    "bg-purple-50 text-purple-700",
                                    "dark:bg-purple-900/30 dark:text-purple-300",
                                ].join(" ")}
                            >
                                عرض
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Chevron */}
            <ChevronLeft
                className={[
                    "h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600",
                    "motion-safe:transition-transform motion-safe:duration-200",
                    "group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
                    "sm:h-[18px] sm:w-[18px]",
                ].join(" ")}
                strokeWidth={2}
                aria-hidden
            />
        </Link>
    );
});
