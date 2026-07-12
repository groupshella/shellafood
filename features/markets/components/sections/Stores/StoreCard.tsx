import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ChevronDown, Clock, Star, Truck } from "lucide-react";
import { Store } from "@/features/markets/types/stores.types";

function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} م`;
    return `${(meters / 1000).toFixed(1)} كم`;
}

function storeSubtitle(store: Store, isArabic: boolean): string {
    if (store.delivery_time) return `توصيل خلال ${store.delivery_time} ${isArabic ? "دقيقة" : "minutes"}`;
    if (store.distance > 0) return `يبعد ${formatDistance(store.distance)} ${isArabic ? "كم" : "km"}`;
    return isArabic ? "متجر متاح للطلب" : "Store available for order";
}

export const StoreCard = memo(function StoreCard({ store, isArabic }: { store: Store, isArabic: boolean }) {
    return (
        <Link
            href={`/stores/${store.id}?module_id=${store.module_id}`}
            className={[
                "group flex h-full min-w-0 items-center gap-2.5 rounded-2xl bg-white p-2.5 sm:gap-3 sm:p-3",
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]",
                "dark:bg-gray-800 dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] dark:ring-white/[0.06]",
                "transition-transform duration-150 active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
            ].join(" ")}
            dir={isArabic ? "rtl" : "ltr"}
            aria-label={store.name}
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/[0.05] dark:bg-gray-700 dark:ring-white/[0.06] sm:h-[72px] sm:w-[72px]">
                {store.logo_full_url ? (
                    <Image
                        src={store.logo_full_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 56px, 72px"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full bg-[#4ADE80] dark:bg-[#30913F]/40" />
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                        {store.name}
                    </h3>
                    <span
                        className={[
                            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:text-[11px]",
                            store.is_open
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
                        ].join(" ")}
                    >
                        {store.is_open ? (isArabic ? "مفتوح" : "Open") : (isArabic ? "مغلق" : "Closed")}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400 sm:gap-x-3 sm:text-xs">
                    {store.avg_rating > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} aria-hidden />
                            {store.avg_rating.toFixed(1)}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" aria-hidden />
                        {storeSubtitle(store, isArabic)}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {store.free_delivery && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#E8F5E9] px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300 sm:px-2 sm:text-[11px]">
                            <Truck className="h-3 w-3" strokeWidth={2} aria-hidden />
                            {isArabic ? "توصيل مجاني" : "Free Delivery"}
                        </span>
                    )}
                    {store.has_offer && (
                        <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 sm:px-2 sm:text-[11px]">
                            {isArabic ? "عرض" : "Offer"}
                        </span>
                    )}
                </div>
            </div>

            <ChevronDown
                className="h-4 w-4 shrink-0 -rotate-90 text-gray-300 transition-transform group-hover:-translate-x-0.5 dark:text-gray-600"
                strokeWidth={2}
                aria-hidden
            />
        </Link>
    );
});
