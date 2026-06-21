import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Bike } from "lucide-react";
import { DiscountedStore } from "@/features/home/types/discounted-stores.types";

function formatDiscount(store: DiscountedStore): string | null {
    if (!store.discount_status) return null;
    return "عرض خاص";
}

export function StoreCard({ store }: { store: DiscountedStore }) {
    const discountLabel = formatDiscount(store);
    const isOpen = store.is_open;

    return (
        <Link
            href={`/stores/${store.id}`}
            className={[
                "group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white",
                "shadow-sm ring-1 ring-black/[0.04] outline-none",
                "transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={store.name}
        >
            <div className="relative aspect-[16/9] w-full bg-gray-100">
                <Image
                    src={store.cover_photo_full_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="260px"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMTQ2Ij48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                />
                {discountLabel && (
                    <span className="absolute start-2 top-2 rounded-full bg-[#30913F] px-2.5 py-1 text-xs font-bold text-white">
                        {discountLabel}
                    </span>
                )}
                {!isOpen && (
                    <span className="absolute end-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                        مغلق
                    </span>
                )}
            </div>

            <div className="relative flex flex-1 flex-col gap-2 p-3">
                <div className="absolute -top-5 start-3 h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]">
                    <Image src={store.logo_full_url} alt="" fill className="object-cover" sizes="40px" loading="lazy" />
                </div>
                <h3 className="line-clamp-1 pe-12 text-sm font-bold text-gray-900">{store.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    {store.avg_rating > 0 && (
                        <span className="inline-flex items-center gap-0.5 font-medium text-gray-700">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {store.avg_rating.toFixed(1)}
                            {store.rating_count > 0 && <span className="text-gray-400">({store.rating_count})</span>}
                        </span>
                    )}
                    {store.delivery_time && (
                        <span className="inline-flex items-center gap-0.5">
                            <Clock className="h-3.5 w-3.5" />
                            {store.delivery_time}
                        </span>
                    )}
                    {store.free_delivery && (
                        <span className="inline-flex items-center gap-0.5 font-medium text-[#30913F]">
                            <Bike className="h-3.5 w-3.5" />
                            توصيل مجاني
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
