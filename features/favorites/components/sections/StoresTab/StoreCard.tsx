"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { Heart, Star, Clock, Truck, Store } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import type { FavoriteStore } from "@/features/favorites/types/favorites.types";

interface StoreCardProps {
    store: FavoriteStore;
    initialFavorited?: boolean;
    onRemove?: (storeId: number) => void;
}

export const StoreCard = memo(function StoreCard({
    store,
    initialFavorited = true,
    onRemove,
}: StoreCardProps) {
    const [favorited, setFavorited] = useState(initialFavorited);
    const [pending, setPending] = useState(false);

    const toggleFavorite = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (pending) return;
            setPending(true);

            const wasLiked = favorited;
            setFavorited(!wasLiked);

            const result = wasLiked
                ? await removeFromWishlist({ storeId: store.id })
                : await addToWishlist({ storeId: store.id });

            if (!result.success) {
                setFavorited(wasLiked);
            } else if (wasLiked && onRemove) {
                onRemove(store.id);
            }

            setPending(false);
        },
        [pending, favorited, store.id, onRemove],
    );

    return (
        <div className="relative h-full min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] lg:rounded-3xl">
            <Link
                href={`/stores/${store.id}`}
                aria-label={store.name}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
            >
                <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-700 sm:h-36 md:h-40">
                    {store.cover_photo ? (
                        <Image
                            src={store.cover_photo}
                            alt={store.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Store className="h-10 w-10 text-gray-300 dark:text-gray-600 sm:h-12 sm:w-12" strokeWidth={1.2} aria-hidden />
                        </div>
                    )}

                    {store.avg_rating > 0 && (
                        <div className="absolute start-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-gray-900/80 sm:start-3 sm:top-3">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" strokeWidth={0} aria-hidden />
                            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 sm:text-xs">
                                {store.avg_rating.toFixed(1)}
                            </span>
                        </div>
                    )}

                    <div className="absolute bottom-2 start-2 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-1.5 sm:bottom-2.5 sm:start-2.5 sm:gap-2">
                        {store.delivery_time && (
                            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-gray-900/80 sm:px-2.5">
                                <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" strokeWidth={1.6} aria-hidden />
                                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 sm:text-[11px]">
                                    {store.delivery_time}
                                </span>
                            </span>
                        )}
                        {store.free_delivery && (
                            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-gray-900/80 sm:px-2.5">
                                <Truck className="h-3 w-3 text-[#30913F] dark:text-[#4db860]" strokeWidth={1.6} aria-hidden />
                                <span className="text-[10px] font-medium text-[#30913F] dark:text-[#4db860] sm:text-[11px]">
                                    توصيل مجاني
                                </span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5" dir="rtl">
                    {store.logo ? (
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-12 sm:w-12">
                            <Image
                                src={store.logo}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 44px, 48px"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-12 sm:w-12">
                            <Store className="h-5 w-5 text-gray-400 dark:text-gray-500" strokeWidth={1.4} aria-hidden />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                            {store.name}
                        </p>
                        {(store.module_type || store.module_id) && (
                            <p className="truncate text-start text-xs text-gray-500 dark:text-gray-400 sm:text-[13px]">
                                {store.module_type ?? `قسم ${store.module_id}`}
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            <button
                type="button"
                aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                aria-pressed={favorited}
                onClick={toggleFavorite}
                disabled={pending}
                className="absolute end-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors active:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] disabled:opacity-60 dark:bg-gray-900/80 sm:end-3 sm:top-3 sm:h-10 sm:w-10"
            >
                <Heart
                    className={[
                        "h-4 w-4 transition-colors",
                        favorited
                            ? "fill-[#30913F] text-[#30913F] dark:fill-[#4db860] dark:text-[#4db860]"
                            : "fill-none text-gray-500 dark:text-gray-400",
                    ].join(" ")}
                    strokeWidth={favorited ? 0 : 1.8}
                    aria-hidden
                />
            </button>
        </div>
    );
});
