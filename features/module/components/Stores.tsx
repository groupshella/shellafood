"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Truck } from "lucide-react";
import { useStores } from "@/features/module/hooks/useStores";
import { Store } from "@/features/module/types/stores.types";

function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} م`;
    return `${(meters / 1000).toFixed(1)} كم`;
}

function storeSubtitle(store: Store): string {
    if (store.delivery_time) return `توصيل خلال ${store.delivery_time}`;
    if (store.distance > 0) return `يبعد ${formatDistance(store.distance)}`;
    return "متجر متاح للطلب";
}

function StoreCard({ store }: { store: Store }) {
    const [coverError, setCoverError] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const showRating = store.avg_rating > 0;

    return (
        <Link
            href={`/store/${store.id}`}
            className={[
                "group block overflow-hidden rounded-2xl bg-white outline-none",
                "shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]",
                "transition-transform duration-150 active:scale-[0.985]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={store.name}
            dir="ltr"
        >
            <div className="relative aspect-[16/10] w-full bg-gray-100 sm:aspect-[16/9]">
                {!coverError && store.cover_photo ? (
                    <Image
                        src={store.cover_photo}
                        alt=""
                        fill
                        className={[
                            "object-cover transition-transform duration-300",
                            store.is_open ? "group-hover:scale-[1.02]" : "grayscale-[0.35]",
                        ].join(" ")}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                        loading="lazy"
                        onError={() => setCoverError(true)}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}

                {showRating && (
                    <span
                        className={[
                            "absolute end-2.5 top-2.5 z-10 inline-flex items-center gap-1",
                            "rounded-lg bg-[#B8EBD0] px-2 py-1 text-xs font-bold text-gray-900",
                        ].join(" ")}
                    >
                        {store.avg_rating.toFixed(1)}
                        <Star className="h-3 w-3 fill-gray-900 text-gray-900" strokeWidth={0} />
                    </span>
                )}

                {store.is_open ?
                    (
                        <span className="absolute start-2.5 top-2.5 z-10 rounded-lg bg-green-500 px-2.5 py-1 text-xs font-medium text-white">
                            مفتوح
                        </span>
                    ) : (
                        <span className="absolute start-2.5 top-2.5 z-10 rounded-lg bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                            مغلق
                        </span>
                    )}

                {store.free_delivery && (
                    <span
                        className={[
                            "absolute bottom-0 left-1/2 z-10 inline-flex -translate-x-1/2 translate-y-1/2",
                            "items-center gap-1.5 rounded-lg border border-gray-200 bg-white",
                            "px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm",
                        ].join(" ")}
                    >
                        <Truck className="h-3.5 w-3.5 text-[#30913F]" strokeWidth={2} />
                        توصيل مجاني
                    </span>
                )}
            </div>

            <div className="relative px-4 pb-4 pt-7">
                <div
                    className={[
                        "absolute -top-7 end-4 h-[3.75rem] w-[3.75rem] overflow-hidden rounded-xl",
                        "border-[3px] border-white bg-white shadow-md ring-1 ring-black/[0.05]",
                        "sm:h-16 sm:w-16",
                    ].join(" ")}
                >
                    {!logoError && store.logo ? (
                        <Image
                            src={store.logo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                            loading="lazy"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="h-full w-full bg-[#4ADE80]" />
                    )}
                </div>

                <div className="pe-[4.5rem] text-end sm:pe-20">
                    <h3 className="line-clamp-1 text-base font-bold text-gray-900 sm:text-lg">
                        {store.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {storeSubtitle(store)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function StoresSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
                >
                    <div className="aspect-[16/10] animate-pulse bg-gray-100 sm:aspect-[16/9]" />
                    <div className="space-y-2 px-4 pb-4 pt-7">
                        <div className="ms-auto h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                        <div className="ms-auto h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface StoresProps {
    moduleId: string;
    moduleName: string;
}

export default function Stores({ moduleId, moduleName }: StoresProps) {
    const { stores, isLoading, isLoadingMore, error, hasMore, loadMore } = useStores(moduleId);

    if (isLoading) {
        return (
            <section className="mx-auto w-full max-w-5xl px-4 sm:px-6" aria-label="المتاجر">
                <StoresSkeleton />
            </section>
        );
    }

    if (error || stores.length === 0) return null;
    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            aria-label="المتاجر"
            className="mx-auto w-full max-w-5xl space-y-4 px-4 sm:px-6"
        >
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                المتاجر القريبة منك
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className={[
                            "rounded-xl bg-[#F6F5F8] px-6 py-2.5 text-sm font-semibold text-gray-800",
                            "transition-colors hover:bg-gray-200",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/30",
                        ].join(" ")}
                    >
                        {isLoadingMore ? "جاري التحميل..." : "عرض المزيد"}
                    </button>
                </div>
            )}
        </motion.section>
    );
}
