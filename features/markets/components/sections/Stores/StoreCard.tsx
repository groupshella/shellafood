import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, Star, Truck } from "lucide-react";
import { Store } from "@/features/markets/types/stores.types";

function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} م`;
    return `${(meters / 1000).toFixed(1)} كم`;
}

function storeSubtitle(store: Store): string {
    if (store.delivery_time) return `توصيل خلال ${store.delivery_time}`;
    if (store.distance > 0) return `يبعد ${formatDistance(store.distance)}`;
    return "متجر متاح للطلب";
}

export function StoreCard({ store }: { store: Store }) {
    return (
        <Link
            href={`/stores/${store.id}?module_id=${store.module_id}`}
            className={[
                "group flex items-center gap-3 rounded-2xl bg-white p-3",
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]",
                "transition-transform duration-150 active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            dir="rtl"
            aria-label={store.name}
        >
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/[0.05]">
                {store.logo_full_url ? (
                    <Image
                        src={store.logo_full_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="72px"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full bg-[#4ADE80]" />
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-bold text-gray-900">{store.name}</h3>
                    <span
                        className={[
                            "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                            store.is_open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
                        ].join(" ")}
                    >
                        {store.is_open ? "مفتوح" : "مغلق"}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {store.avg_rating > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                            {store.avg_rating.toFixed(1)}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {storeSubtitle(store)}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {store.free_delivery && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-medium text-green-700">
                            <Truck className="h-3 w-3" strokeWidth={2} />
                            توصيل مجاني
                        </span>
                    )}
                    {store.has_offer && (
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                            عرض
                        </span>
                    )}
                </div>
            </div>

            <ChevronDown
                className="h-4 w-4 shrink-0 -rotate-90 text-gray-300 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={2}
            />
        </Link>
    );
}
