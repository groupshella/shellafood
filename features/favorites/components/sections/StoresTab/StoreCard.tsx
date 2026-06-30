"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Star, Clock, Truck, Store } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import type { FavoriteStore } from "@/features/favorites/types/favorites.types";

interface StoreCardProps {
    store: FavoriteStore;
    initialFavorited?: boolean;
    onRemove?: (storeId: number) => void;
}

export function StoreCard({
    store,
    initialFavorited = true,
    onRemove,
}: StoreCardProps) {
    const [favorited, setFavorited] = useState(initialFavorited);
    const [pending, setPending] = useState(false);

    async function toggleFavorite() {
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
    }

    return (
        <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
            {/* Banner area */}
            <div className="relative h-[140px] w-full bg-[#F6F5F8]">
                {store.banner ? (
                    <Image
                        src={store.banner}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 600px"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Store className="h-12 w-12 text-gray-300" strokeWidth={1.2} aria-hidden />
                    </div>
                )}

                {/* Heart button — top left (LTR: start) */}
                <button
                    type="button"
                    aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    onClick={toggleFavorite}
                    disabled={pending}
                    className="absolute start-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#EBFEEB] shadow-sm transition-colors active:bg-[#DCF5DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                >
                    <Heart
                        className={[
                            "h-4 w-4 transition-colors",
                            favorited
                                ? "fill-[#30913F] text-[#30913F]"
                                : "fill-none text-[#30913F]",
                        ].join(" ")}
                        strokeWidth={favorited ? 0 : 1.8}
                    />
                </button>

                {/* Rating pill — top right (LTR: end) */}
                {store.rating != null && (
                    <div className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-[#EBFEEB] px-2 py-1 shadow-sm">
                        <Star
                            className="h-3 w-3 fill-[#30913F] text-[#30913F]"
                            strokeWidth={0}
                            aria-hidden
                        />
                        <span className="text-[11px] font-bold text-[#30913F]">
                            {store.rating.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Bottom pills */}
                <div className="absolute bottom-2.5 start-2.5 flex items-center gap-1.5">
                    {store.delivery_time != null && (
                        <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                            <Clock className="h-3 w-3 text-gray-500" strokeWidth={1.6} aria-hidden />
                            <span className="text-[11px] font-medium text-gray-700">
                                {store.delivery_time} دقيقة
                            </span>
                        </span>
                    )}
                    {store.free_delivery && (
                        <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                            <Truck className="h-3 w-3 text-[#30913F]" strokeWidth={1.6} aria-hidden />
                            <span className="text-[11px] font-medium text-[#30913F]">توصيل مجاني</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Info row */}
            <div className="flex items-center gap-3 px-4 py-3" dir="rtl">
                {/* Logo */}
                {store.logo ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F6F5F8]">
                        <Image
                            src={store.logo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F6F5F8]">
                        <Store className="h-5 w-5 text-gray-300" strokeWidth={1.4} aria-hidden />
                    </div>
                )}

                {/* Name + type */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-[#111B18]">
                        {store.name}
                    </p>
                    {store.module_type && (
                        <p className="truncate text-[12px] text-[#707784]">
                            {store.module_type}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
