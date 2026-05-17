"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Star, Bike, Tag } from "lucide-react";
import { ApiStore } from "../../types/store.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreCardProps {
  store: ApiStore;
}

// ─── Data helper ──────────────────────────────────────────────────────────────

function getStoreData(store: ApiStore) {
  return {
    href: `/categories/${store.module_id}/${store.id}`,
    initial: store.name?.trim()?.charAt(0) ?? "?",
    isOpen: store.is_open ?? store.open === 1,
    avgRating: store.avg_rating ?? 0,
    ratingCount: store.rating_count ?? 0,
    deliveryFee: store.delivery?.delivery_fee ?? store.minimum_shipping_charge ?? 0,
    deliveryTime: store.delivery?.delivery_time_range ?? store.delivery_time ?? null,
  };
}

// ─── StoreCard ────────────────────────────────────────────────────────────────

export const StoreCard = memo(({ store }: StoreCardProps) => {
  const { href, initial, isOpen, avgRating, ratingCount, deliveryFee, deliveryTime } =
    getStoreData(store);

  return (
    <Link
      href={href}
      aria-label={`${store.name}، ${isOpen ? "مفتوح" : "مغلق"}`}
      className="group relative block overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700/80 dark:hover:border-green-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/70 focus-visible:ring-offset-2 active:scale-[0.985]"
    >
      {/* ── Cover image ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {store.cover_photo_full_url ? (
          <Image
            src={store.cover_photo_full_url}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/20">
            <span className="text-5xl font-black text-green-200 dark:text-green-700">
              {initial}
            </span>
          </div>
        )}

        {/* Subtle bottom scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Free delivery badge */}
        {deliveryFee === 0 && (
          <div className="absolute start-2.5 top-2.5 flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white shadow ring-1 ring-white/20 dark:bg-green-500">
            <Tag className="h-2.5 w-2.5 shrink-0" aria-hidden />
            توصيل مجاني
          </div>
        )}

        {/* Closed overlay */}
        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-bold tracking-wide text-white">
              مغلق
            </span>
          </div>
        )}

        {/* Floating logo — anchored bottom-end, half overlapping the body */}
        {store.logo_full_url && (
          <div className="absolute bottom-6 start-3 z-10 h-12 w-12 translate-y-1/2 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900 dark:ring-white/10">
            <Image
              src={store.logo_full_url}
              alt={store.name ?? ""}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* ── Info body ── */}
      <div className="px-3.5 pb-3.5 pt-5">
        {/* Name + address — padded end to avoid logo overlap */}
        <div className="pe-12 min-h-[2.25rem]">
          <h3 className="truncate text-sm font-bold leading-snug text-gray-900 dark:text-white sm:text-[0.9375rem]">
            {store.name}
          </h3>
          {store.address && (
            <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
              {store.address}
            </p>
          )}
        </div>

        {/* Metrics row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="inline-flex items-center gap-0.5 font-semibold text-amber-500 dark:text-amber-400">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            <span className="text-xs">{avgRating.toFixed(1)}</span>
            {ratingCount > 0 && (
              <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500">
                ({ratingCount})
              </span>
            )}
          </span>

          {deliveryTime && (
            <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              {deliveryTime}
            </span>
          )}

          <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
            <Bike className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
            {deliveryFee === 0 ? "مجاني" : `${deliveryFee} ر.س`}
          </span>
        </div>
      </div>
    </Link>
  );
});

StoreCard.displayName = "StoreCard";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const StoreCardSkeleton = memo(() => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse dark:border-gray-700 dark:bg-gray-800">
    <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700" />
    <div className="px-3.5 pb-3.5 pt-5 space-y-2">
      <div className="h-4 w-3/5 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-2/5 rounded-lg bg-gray-100 dark:bg-gray-600" />
    </div>
  </div>
));

StoreCardSkeleton.displayName = "StoreCardSkeleton";