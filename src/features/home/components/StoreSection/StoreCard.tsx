"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiStore } from "../../types/store.types";
import {
  Clock,
  Star,
  Bike,
  Tag,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

interface StoreCardProps {
  store: ApiStore;
  variant?: "default" | "compact" | "wide";
  showBadges?: boolean;
}

const busyStyles: Record<string, string> = {
  quiet: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/50 dark:ring-emerald-900",
  normal: "text-slate-700 bg-slate-100 ring-1 ring-slate-200/80 dark:text-slate-200 dark:bg-slate-800 dark:ring-slate-600",
  busy: "text-amber-800 bg-amber-50 ring-1 ring-amber-100 dark:text-amber-200 dark:bg-amber-950/40 dark:ring-amber-900",
  very_busy: "text-red-800 bg-red-50 ring-1 ring-red-100 dark:text-red-200 dark:bg-red-950/40 dark:ring-red-900",
};

/** Short Arabic copy — layout is `dir="rtl"` */
const busyLabelAr: Record<string, string> = {
  quiet: "هادئ",
  normal: "عادي",
  busy: "مزدحم",
  very_busy: "ازدحام شديد",
};

const badgeIcons: Record<string, React.ReactNode> = {
  fast_delivery: <Zap className="h-3 w-3 shrink-0" aria-hidden />,
  high_rated: <Award className="h-3 w-3 shrink-0" aria-hidden />,
  popular: <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />,
  new: <Sparkles className="h-3 w-3 shrink-0" aria-hidden />,
};

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/90 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900";

const pressMotion = "motion-safe:active:scale-[0.99] motion-safe:transition-transform duration-150";

export function StoreCard({
  store,
  variant = "default",
  showBadges = true,
}: StoreCardProps) {
  const avgRating = store.avg_rating ?? 0;
  const isOpen = store.status?.is_open ?? store.open === 1;
  const deliveryFee =
    store.delivery?.delivery_fee ?? store.minimum_shipping_charge ?? 0;
  const deliveryTime =
    store.delivery_time ?? store.delivery?.delivery_time_range ?? null;
  const busyLevel = store.status?.busy_level ?? "normal";
  const href = `/categories/${store.module_id}/${store.id}`;
  const initial = store.name?.trim()?.charAt(0) ?? "?";

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={`group flex min-h-[3.25rem] touch-manipulation items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-[border-color,box-shadow,background-color] duration-200 hover:border-green-200 hover:bg-green-50/30 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700/60 dark:hover:bg-gray-800/90 sm:gap-3.5 sm:p-3.5 ${linkFocus} ${pressMotion}`}
        aria-label={`${store.name} — ${isOpen ? "مفتوح" : "مغلق"}`}
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5 dark:bg-gray-700 dark:ring-white/10">
          {store.logo_full_url ? (
            <Image
              src={store.logo_full_url}
              alt=""
              fill
              sizes="56px"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 text-xl font-bold text-green-700 dark:from-green-900/40 dark:to-emerald-900/30 dark:text-green-300">
              {initial}
            </div>
          )}
          {!isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
              <span className="rounded bg-black/35 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                مغلق
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-snug text-gray-900 dark:text-white">
            {store.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Star className="h-3 w-3 fill-current" aria-hidden />
              {avgRating.toFixed(1)}
            </span>
            {deliveryTime && (
              <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                <span className="truncate">{deliveryTime}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "wide") {
    return (
      <Link
        href={href}
        className={`group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-green-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700/50 sm:flex-row sm:items-stretch sm:gap-4 sm:p-4 ${linkFocus} ${pressMotion}`}
        aria-label={`${store.name} — ${isOpen ? "مفتوح" : "مغلق"}`}
      >
        <div className="relative mx-auto aspect-[16/10] w-full max-w-sm shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5 sm:mx-0 sm:aspect-square sm:h-24 sm:w-24 sm:max-w-none dark:bg-gray-700 dark:ring-white/10">
          {store.cover_photo_full_url || store.logo_full_url ? (
            <Image
              src={(store.cover_photo_full_url ?? store.logo_full_url)!}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 96px"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full min-h-[7rem] items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 text-3xl font-bold text-green-700 dark:from-green-900/40 dark:to-emerald-900/30 dark:text-green-300 sm:min-h-0">
              {initial}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-white">
                {store.name}
              </h3>
              {store.address ? (
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {store.address}
                </p>
              ) : null}
            </div>
            <span
              className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-semibold sm:self-auto ${isOpen
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
              {isOpen ? "مفتوح" : "مغلق"}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Star className="h-4 w-4 fill-current" aria-hidden />
              {avgRating.toFixed(1)}
              <span className="font-normal text-gray-400 dark:text-gray-500">
                ({store.rating_count ?? 0})
              </span>
            </span>
            {deliveryTime ? (
              <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                {deliveryTime}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Bike className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
              {deliveryFee === 0 ? "توصيل مجاني" : `${deliveryFee} ر.س`}
            </span>
          </div>
          {showBadges && store.badges?.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {store.badges.slice(0, 3).map((badge) => (
                <span
                  key={badge.type}
                  className="inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight"
                  style={{
                    color: badge.color,
                    borderColor: `${badge.color}40`,
                    backgroundColor: `${badge.color}15`,
                  }}
                >
                  {badgeIcons[badge.type]}
                  <span className="truncate">
                    {badge.label_ar?.trim() || badge.label}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    );
  }

  // Default — vertical card for carousels & grids
  return (
    <Link
      href={href}
      className={`group relative block touch-manipulation overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-green-200 hover:shadow-xl motion-safe:hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700/50 ${linkFocus} ${pressMotion}`}
      aria-label={`${store.name} — ${isOpen ? "مفتوح" : "مغلق"}`}
    >
      <div className="relative aspect-[5/4] min-h-[7.25rem] w-full sm:aspect-[5/4] sm:min-h-[9rem] md:min-h-[9.5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600" />
        {store.cover_photo_full_url ? (
          <Image
            src={store.cover_photo_full_url}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/20">
            <span className="text-4xl font-black text-green-300/90 dark:text-green-600/40 sm:text-5xl">
              {initial}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80 dark:from-black/40" />

        {!isOpen ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold tracking-wide text-white">
              مغلق
            </span>
          </div>
        ) : null}

        {deliveryFee === 0 ? (
          <div className="absolute start-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md ring-1 ring-white/20 dark:bg-green-500">
            <Tag className="h-2.5 w-2.5 shrink-0" aria-hidden />
            <span className="truncate">توصيل مجاني</span>
          </div>
        ) : null}

        {store.logo_full_url ? (
          <div className="absolute bottom-0 end-3 rtl:start-3 z-[1] h-12 w-12 translate-y-1/2 overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900 dark:ring-white/10">
            <Image
              src={store.logo_full_url}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="relative px-3 pb-3 pt-5 sm:px-3.5 sm:pb-3.5 sm:pt-6">
        <div className="min-h-[2.5rem] pe-14">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 dark:text-white sm:line-clamp-1 sm:text-[0.9375rem]">
            {store.name}
          </h3>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            {avgRating.toFixed(1)}
          </span>
          {deliveryTime ? (
            <span className="inline-flex min-w-0 max-w-full items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
              <span className="truncate">{deliveryTime}</span>
            </span>
          ) : null}
          <span
            className={`inline-flex max-w-full items-center truncate rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${busyStyles[busyLevel] ?? busyStyles.normal}`}
          >
            {busyLabelAr[busyLevel] ?? busyLevel.replace(/_/g, " ")}
          </span>
        </div>

        {showBadges && store.badges?.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {store.badges.slice(0, 2).map((badge) => (
              <span
                key={badge.type}
                className="inline-flex max-w-[calc(50%-0.125rem)] items-center gap-0.5 truncate rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:max-w-[55%]"
                style={{
                  color: badge.color,
                  backgroundColor: `${badge.color}22`,
                }}
              >
                {badgeIcons[badge.type]}
                <span className="truncate">
                  {badge.label_ar?.trim() || badge.label}
                </span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export function StoreCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact" | "wide";
}) {
  if (variant === "compact") {
    return (
      <div className="flex min-h-[3.25rem] animate-pulse items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 sm:gap-3.5 sm:p-3.5">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2.5 w-1/2 rounded bg-gray-100 dark:bg-gray-600" />
        </div>
      </div>
    );
  }
  if (variant === "wide") {
    return (
      <div className="flex animate-pulse flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:gap-4 sm:p-4">
        <div className="mx-auto aspect-[16/10] w-full max-w-sm shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700 sm:mx-0 sm:aspect-square sm:h-24 sm:w-24" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-600" />
          <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-600" />
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse dark:border-gray-700 dark:bg-gray-800">
      <div className="aspect-[5/4] min-h-[7.25rem] w-full bg-gray-200 dark:bg-gray-700 sm:min-h-[9rem]" />
      <div className="px-3 pb-3 pt-5 sm:px-3.5 sm:pb-3.5 sm:pt-6">
        <div className="mb-2 h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-600" />
      </div>
    </div>
  );
}
