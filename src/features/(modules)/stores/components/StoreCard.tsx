"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Store } from "../types/stores.type";

interface StoreCardProps {
    store: Store;
    index?: number;
    isCompact?: boolean;
    isArabic?: boolean;
}

function resolveImageUrl(pathOrUrl: string | undefined, folder: "logo" | "cover"): string | null {
    if (!pathOrUrl) return null;
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
        return pathOrUrl;
    }
    const base =
        folder === "logo"
            ? "https://shellafood.com/storage/store/"
            : "https://shellafood.com/storage/store/cover/";
    return `${base}${pathOrUrl}`;
}

function StoreCard({ store, index = 0, isCompact = false, isArabic = true }: StoreCardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [imageError, setImageError] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const storeName = store.name || (isArabic ? "متجر" : "Store");
    const distanceKm =
        Number.isFinite(store.distance) ? (store.distance / 1000).toFixed(1) : null;

    const logoUrl = useMemo(() => {
        if (imageError) return null;
        return resolveImageUrl(store.logo, "logo");
    }, [store.logo, imageError]);

    const coverUrl = useMemo(() => {
        if (imageError) return null;
        return resolveImageUrl(store.cover_photo, "cover");
    }, [store.cover_photo, imageError]);

    const handleClick = useCallback(() => {
        if (isNavigating) return;
        setIsNavigating(true);
        const moduleName = searchParams.get("moduleName") ?? "";
        router.push(
            `/categories/${store.module_id}/${store.id}?moduleName=${moduleName}&storeName=${encodeURIComponent(store.name)}`,
            { scroll: true },
        );
    }, [isNavigating, router, searchParams, store.id, store.module_id, store.name]);

    const statusBadge = store.is_open ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow sm:px-3 sm:py-1 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white sm:h-2 sm:w-2" />
            {isArabic ? "مفتوح" : "Open"}
        </span>
    ) : (
        <span className="rounded-full bg-gray-800/90 px-2 py-0.5 text-[10px] font-bold text-white shadow sm:px-3 sm:py-1 sm:text-xs">
            {isArabic ? "مغلق" : "Closed"}
        </span>
    );

    const metaRow = (
        <div className={`flex flex-wrap items-center gap-2 ${isCompact ? "text-[10px]" : "text-xs sm:text-sm"}`}>
            {store.avg_rating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-50 px-1.5 py-0.5 dark:bg-yellow-900/20">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />
                    <span className="font-bold text-gray-900 dark:text-white">{store.avg_rating.toFixed(1)}</span>
                    {store.rating_count > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">({store.rating_count})</span>
                    )}
                </span>
            )}
            {distanceKm && (
                <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {distanceKm} {isArabic ? "كم" : "km"}
                </span>
            )}
            {store.delivery_time && (
                <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {store.delivery_time}
                </span>
            )}
        </div>
    );

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * (isCompact ? 0.03 : 0.05) }}
            onClick={handleClick}
            className={`group relative h-full cursor-pointer ${isNavigating ? "pointer-events-none opacity-75" : ""}`}
            whileHover={{ scale: isCompact ? 1.02 : 1.01 }}
            whileTap={{ scale: 0.98 }}
        >
            <div
                className={`relative h-full overflow-hidden rounded-xl border bg-white transition-all dark:bg-gray-800 sm:rounded-2xl ${isNavigating
                    ? "border-green-500 shadow-lg dark:border-green-400"
                    : "border-gray-200 hover:border-green-500 hover:shadow-lg dark:border-gray-700 dark:hover:border-green-400"
                    }`}
            >
                <div
                    className={`relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ${isCompact ? "h-28 sm:h-32" : "h-40 sm:h-48 md:h-52"
                        }`}
                >
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={storeName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes={
                                isCompact
                                    ? "(max-width: 640px) 50vw, 33vw"
                                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            }
                            priority={index < 4}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className={isCompact ? "text-2xl" : "text-4xl sm:text-5xl"}>🏪</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    <div className={`absolute top-2 ${isArabic ? "right-2" : "left-2"} sm:top-3 ${isArabic ? "sm:right-3" : "sm:left-3"}`}>
                        {statusBadge}
                    </div>

                    {logoUrl && (
                        <div
                            className={`absolute bottom-2 overflow-hidden rounded-lg border-2 border-white bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${isArabic ? "right-2" : "left-2"
                                } ${isCompact ? "h-9 w-9" : "h-12 w-12 sm:h-14 sm:w-14"}`}
                        >
                            <Image
                                src={logoUrl}
                                alt={storeName}
                                fill
                                className="object-cover"
                                sizes={isCompact ? "36px" : "56px"}
                                onError={() => setImageError(true)}
                            />
                        </div>
                    )}
                </div>

                <div className={isCompact ? "space-y-1.5 p-2.5" : "space-y-2 p-3 sm:p-4"}>
                    <h3
                        className={`truncate font-bold text-gray-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400 ${isCompact ? "text-sm" : "text-base sm:text-lg"
                            }`}
                    >
                        {storeName}
                    </h3>
                    {metaRow}
                </div>

                {isNavigating && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-sm dark:bg-black/40 sm:rounded-2xl">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-8 sm:w-8" />
                    </div>
                )}
            </div>
        </motion.article>
    );
}

export default memo(StoreCard);
