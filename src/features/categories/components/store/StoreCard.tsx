// features/categories/components/store/StoreCard.tsx

"use client";

import { useLanguage } from "@/providers";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useState, useCallback, useMemo } from "react";
import type { Store } from "../../types/store.types";

/** Shape returned by `/api/stores` list items (see stores route logs). */
export interface StoreCardStore {
  id: number;
  name: string;
  module_id: number;
  logo: string;
  cover_photo: string;
  avg_rating: number;
  rating_count: number;
  delivery_time: string;
  distance: number;
  is_open: boolean;
}

function toCardStore(store: Store | StoreCardStore): StoreCardStore {
  const s = store as Store & Partial<StoreCardStore>;
  const isOpen =
    typeof s.is_open === "boolean"
      ? s.is_open
      : s.open === 1 || Boolean(s.is_open_now);

  return {
    id: s.id,
    name: s.name,
    module_id: s.module_id,
    logo: s.logo ?? "",
    cover_photo: s.cover_photo ?? "",
    avg_rating: s.avg_rating ?? 0,
    rating_count: s.rating_count ?? 0,
    delivery_time: s.delivery_time ?? "",
    distance: typeof s.distance === "number" ? s.distance : 0,
    is_open: isOpen,
  };
}

interface StoreCardProps {
  store: Store | StoreCardStore;
  index?: number;
  isCompact?: boolean;
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

function StoreCard({ store: storeProp, index = 0, isCompact = false }: StoreCardProps) {
  const store = useMemo(() => toCardStore(storeProp), [storeProp]);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const searchParams = useSearchParams();
  const storeName = store.name || (isArabic ? "متجر" : "Store");
  const isOpen = store.is_open;
  const rating = store.avg_rating ?? 0;
  const ratingCount = store.rating_count ?? 0;
  const distanceKm =
    typeof store.distance === "number" && Number.isFinite(store.distance)
      ? (store.distance / 1000).toFixed(1)
      : null;
  const deliveryTime = store.delivery_time || null;

  const logoUrl = useMemo(() => {
    if (imageError) return null;
    return resolveImageUrl(store.logo, "logo");
  }, [store.logo, imageError]);

  const coverUrl = useMemo(() => {
    if (imageError) return null;
    return resolveImageUrl(store.cover_photo, "cover");
  }, [store.cover_photo, imageError]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isNavigating) return;
      e.preventDefault();
      setIsNavigating(true);
      setTimeout(() => {
        router.push(`/categories/${store.module_id}/${store.id}?moduleName=${searchParams.get('moduleName')}&storeName=${store.name}`, { scroll: true });
      }, 150);
    },
    [router, store.module_id, store.id, isNavigating, searchParams]
  );

  if (isCompact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={handleClick}
        className={`group cursor-pointer h-full ${isNavigating ? "pointer-events-none opacity-75" : ""}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className={`relative h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden border transition-all duration-300 ${isNavigating
            ? "border-green-500 dark:border-green-400 shadow-lg"
            : "border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg"
            }`}
        >
          <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={storeName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className={`absolute top-2 ${isArabic ? "right-2" : "left-2"}`}>
              {isOpen ? (
                <div className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] font-bold shadow-lg flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {isArabic ? "مفتوح" : "Open"}
                </div>
              ) : (
                <div className="px-2 py-0.5 rounded-full bg-gray-800/90 text-white text-[9px] font-bold shadow-lg">
                  {isArabic ? "مغلق" : "Closed"}
                </div>
              )}
            </div>

            {logoUrl && (
              <div
                className={`absolute bottom-2 ${isArabic ? "right-2" : "left-2"} w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden shadow-lg`}
              >
                <Image
                  src={logoUrl}
                  alt={storeName}
                  fill
                  className="object-cover"
                  sizes="40px"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>

          <div className="p-2.5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {storeName}
            </h3>

            <div className="flex items-center justify-between gap-2 mb-2">
              {rating > 0 && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-50 dark:bg-yellow-900/20">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
                  {ratingCount > 0 && (
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">({ratingCount})</span>
                  )}
                </div>
              )}
              {distanceKm && (
                <div className="flex items-center gap-0.5 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px]">
                    {distanceKm} {isArabic ? "كم" : "km"}
                  </span>
                </div>
              )}
            </div>

            {deliveryTime && (
              <div className="flex items-center gap-0.5 text-[10px] text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{deliveryTime}</span>
              </div>
            )}
          </div>

          {isNavigating && (
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
      className={`group cursor-pointer ${isNavigating ? "pointer-events-none opacity-75" : ""}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border transition-all duration-300 ${isNavigating
          ? "border-green-500 dark:border-green-400 shadow-xl"
          : "border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-xl"
          }`}
      >
        <div className="relative h-48 sm:h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={storeName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 4}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-5xl">🏪</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className={`absolute top-3 ${isArabic ? "right-3" : "left-3"}`}>
            {isOpen ? (
              <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{isArabic ? "مفتوح الآن" : "Open Now"}</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-gray-800/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                {isArabic ? "مغلق" : "Closed"}
              </div>
            )}
          </div>

          {deliveryTime && (
            <div className={`absolute top-3 ${isArabic ? "left-3" : "right-3"}`}>
              <div className="px-3 py-1 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold shadow-lg flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{deliveryTime}</span>
              </div>
            </div>
          )}

          {logoUrl && (
            <div
              className={`absolute -bottom-6 ${isArabic ? "right-4" : "left-4"} w-16 h-16 rounded-xl bg-white dark:bg-gray-800 border-3 border-white dark:border-gray-700 overflow-hidden shadow-xl z-10`}
            >
              <Image
                src={logoUrl}
                alt={storeName}
                fill
                className="object-cover"
                sizes="64px"
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>

        <div className={`p-4 ${logoUrl ? "pt-8" : "pt-4"}`}>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
            {storeName}
          </h3>

          <div className="flex flex-wrap items-center gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            {rating > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
                </div>
                {ratingCount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({ratingCount > 999 ? "999+" : ratingCount})
                  </span>
                )}
              </div>
            )}

            {distanceKm && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {distanceKm} {isArabic ? "كم" : "km"}
                </span>
              </div>
            )}

            {deliveryTime && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 sm:ml-auto">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{deliveryTime}</span>
              </div>
            )}
          </div>

          {isNavigating && (
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(StoreCard);
