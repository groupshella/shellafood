"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Heart, Search, Star, Truck } from "lucide-react";
import { useStoreDetails } from "@/features/store/hooks/useStoreDetails";
import { StoreDetailsCategory } from "@/features/store/types/store-details.types";

function StoreCategoryCard({ category }: { category: StoreDetailsCategory }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className={[
                "relative aspect-square overflow-hidden rounded-2xl bg-[#E8F5E9]",
                "outline-none transition-transform duration-150 active:scale-[0.97]",
            ].join(" ")}
            aria-label={category.name}
        >
            <h3 className="relative z-10 line-clamp-2 px-2.5 pt-3 text-center text-[13px] font-bold leading-tight text-[#1B5E20] sm:text-sm">
                {category.name}
            </h3>

            <div className="absolute inset-x-0 bottom-0 h-[58%]">
                {!imageError && category.full_image_url ? (
                    <Image
                        src={category.full_image_url}
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 640px) 25vw, 120px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full items-end justify-center pb-3 opacity-40">
                        <span className="text-2xl" aria-hidden>
                            🛒
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function StorePageSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[16/10] w-full bg-gray-200 sm:aspect-[16/9]" />
            <div className="space-y-4 px-4 py-5">
                <div className="flex items-start gap-3">
                    <div className="ms-auto h-16 w-16 rounded-xl bg-gray-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-2/3 rounded bg-gray-100" />
                        <div className="h-4 w-full rounded bg-gray-100" />
                    </div>
                    <div className="h-8 w-14 rounded-lg bg-gray-100" />
                </div>
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-gray-100" />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface StorePageProps {
    storeId: string;
    moduleId?: string;
}

export default function StorePage({ storeId, moduleId }: StorePageProps) {
    const router = useRouter();
    const { store, isLoading, error } = useStoreDetails(storeId, moduleId);
    const [coverError, setCoverError] = useState(false);
    const [logoError, setLogoError] = useState(false);

    if (isLoading) return <StorePageSkeleton />;

    if (error || !store) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
                <p className="text-sm font-medium text-gray-600">
                    {error ?? "تعذّر تحميل بيانات المتجر"}
                </p>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-semibold text-[#30913F] hover:underline"
                >
                    العودة
                </button>
            </div>
        );
    }

    const showRating = store.rating > 0;
    const searchHref = `/search?module_id=${moduleId ?? store.module_id}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
            dir="rtl"
        >
            {/* Hero banner */}
            <div className="relative aspect-[16/10] w-full bg-gray-100 sm:aspect-[16/9]">
                {!coverError && store.cover_photo_full_url ? (
                    <Image
                        src={store.cover_photo_full_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                        onError={() => setCoverError(true)}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20" />

                {/* Top actions */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center gap-2">
                        <Link
                            href={searchHref}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                            aria-label="بحث"
                        >
                            <Search className="h-[18px] w-[18px] text-gray-800" strokeWidth={2} />
                        </Link>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                            aria-label="إضافة إلى المفضلة"
                        >
                            <Heart className="h-[18px] w-[18px] text-gray-800" strokeWidth={2} />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                        aria-label="رجوع"
                    >
                        <ArrowRight className="h-5 w-5 text-gray-800" strokeWidth={2} />
                    </button>
                </div>

                {/* Delivery badges */}
                <div className="absolute inset-x-0 bottom-4 z-10 flex flex-wrap items-center justify-center gap-2 px-4">
                    {store.delivery_time && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-700" strokeWidth={2} />
                            {store.delivery_time}
                        </span>
                    )}
                    {store.free_delivery && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-sm">
                            <Truck className="h-3.5 w-3.5 text-[#30913F]" strokeWidth={2} />
                            توصيل مجاني
                        </span>
                    )}
                </div>
            </div>

            {/* Store info */}
            <div className="bg-white px-4 py-5">
                <div className="flex items-start gap-3">
                    <div
                        className={[
                            "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl",
                            "border-[3px] border-white bg-white shadow-md ring-1 ring-black/[0.05]",
                        ].join(" ")}
                    >
                        {!logoError && store.logo_full_url ? (
                            <Image
                                src={store.logo_full_url}
                                alt={store.store_name}
                                fill
                                className="object-cover"
                                sizes="64px"
                                priority
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <div className="h-full w-full bg-[#4ADE80]" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1 text-start">
                        <h1 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                            {store.store_name}
                        </h1>
                        {store.store_description && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                {store.store_description}
                            </p>
                        )}
                    </div>

                    {showRating && (
                        <span
                            className={[
                                "inline-flex shrink-0 items-center gap-1 rounded-lg",
                                "bg-[#B8EBD0] px-2 py-1 text-xs font-bold text-gray-900",
                            ].join(" ")}
                        >
                            {store.rating.toFixed(1)}
                            <Star className="h-3 w-3 fill-gray-900 text-gray-900" strokeWidth={0} />
                        </span>
                    )}
                </div>
            </div>

            {/* Categories grid */}
            {store.category_details.length > 0 && (
                <section aria-label="تصنيفات المتجر" className="bg-white px-4 pb-6">
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                        {store.category_details.map((category) => (
                            <StoreCategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </section>
            )}
        </motion.div>
    );
}
