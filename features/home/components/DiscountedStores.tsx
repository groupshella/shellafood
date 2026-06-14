"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Bike } from "lucide-react";
import { useDiscountedStores } from "@/features/home/hooks/useDiscountedStores";
import { DiscountedStore } from "@/features/home/types/discounted-stores.types";

function formatDiscount(store: DiscountedStore): string | null {
    if (!store.discount_status) return null;
    return "عرض خاص";
}

function StoreCard({ store }: { store: DiscountedStore }) {
    const [coverError, setCoverError] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const discountLabel = formatDiscount(store);
    const isOpen = store.is_open;

    return (
        <Link
            href={`/store/${store.slug}`}
            className={[
                "group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white",
                "shadow-sm ring-1 ring-black/[0.04] outline-none",
                "transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={store.name}
        >
            <div className="relative aspect-[16/9] w-full bg-gray-100">
                {!coverError && store.cover_photo_full_url ? (
                    <Image
                        src={store.cover_photo_full_url}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="260px"
                        onError={() => setCoverError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" />
                )}

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
                    {!logoError && store.logo_full_url ? (
                        <Image
                            src={store.logo_full_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-100" />
                    )}
                </div>

                <h3 className="line-clamp-1 pe-12 text-sm font-bold text-gray-900">
                    {store.name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    {store.avg_rating > 0 && (
                        <span className="inline-flex items-center gap-0.5 font-medium text-gray-700">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {store.avg_rating.toFixed(1)}
                            {store.rating_count > 0 && (
                                <span className="text-gray-400">({store.rating_count})</span>
                            )}
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

function DiscountedStoresSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[220px] w-[260px] shrink-0 animate-pulse rounded-2xl bg-gray-100"
                    />
                ))}
            </div>
        </div>
    );
}

export default function DiscountedStores() {
    const { stores, isLoading, error } = useDiscountedStores();

    if (isLoading) return <DiscountedStoresSkeleton />;
    if (error || stores.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            aria-label="متاجر بخصومات"
            className="mx-auto w-full max-w-5xl space-y-3 px-4"
        >
            <h2 className="text-lg font-bold text-gray-800">متاجر بخصومات</h2>
            <div
                className={[
                    "flex gap-3 overflow-x-auto pb-1",
                    "snap-x snap-mandatory scroll-smooth",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
            >
                {stores.map((store) => (
                    <div key={store.id} className="snap-start">
                        <StoreCard store={store} />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
