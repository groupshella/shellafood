// ============================================================================
// STORE HERO COMPONENT - REDESIGNED UI
// ============================================================================
"use client";

import { memo, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { Star, Clock, MapPin, Share2, ExternalLink } from "lucide-react";
import { useLanguage } from "@/providers";
import { FavoriteButton } from "@/shared/components/ui";
import { useStoreFavorites } from "@/shared/hooks";
import { getImageBlurDataURL, getImageQuality } from "@/lib/utils/imageOptimization";
import type { StoreDetails } from "../../types/store.details.types";
import LocationModal from "./LocationModal";

// ============================================================================
// TYPES
// ============================================================================

interface StoreHeroProps {
  store: StoreDetails;
}

interface Translation {
  locale?: string;
  key?: string;
  value?: string;
}

// ============================================================================
// HELPER FUNCTIONS (all logic unchanged)
// ============================================================================

const getTranslation = (
  translations: Translation[] | undefined,
  key: string,
  locale: string,
  fallback: string
): string => {
  if (!translations?.length) return fallback;
  const translation = translations.find(
    (t) => t?.locale === locale && t?.key === key && t?.value
  );
  return translation?.value || fallback;
};

const formatDistance = (distance: number | undefined, isArabic: boolean): string | null => {
  if (!distance || typeof distance !== "number" || distance <= 0) return null;
  const km = distance / 1000;
  return `${km.toFixed(1)} ${isArabic ? "كم" : "km"}`;
};

const isValidCoordinates = (
  lat: string | number | undefined,
  lng: string | number | undefined
): boolean => {
  if (!lat || !lng) return false;
  const latitude = parseFloat(String(lat));
  const longitude = parseFloat(String(lng));
  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const formatRatingCount = (count: number | undefined): number => {
  if (!count || count <= 0) return 0;
  return count > 999 ? 999 : count;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function StoreHero({ store }: StoreHeroProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // ── computed values (all logic unchanged) ──────────────────────────────

  const displayName = useMemo(() => {
    if (!store?.name) return isArabic ? "متجر" : "Store";
    if (isArabic)
      return getTranslation(store.translations as Translation[], "name", "ar", store.name);
    return store.name;
  }, [store, isArabic]);

  const displayType = useMemo(() => {
    if (!store?.module?.module_name) return "";
    if (isArabic)
      return getTranslation(
        store.module.translations as Translation[],
        "module_name",
        "ar",
        store.module.module_name
      );
    return store.module.module_name;
  }, [store?.module, isArabic]);

  const displayDeliveryTime = useMemo(() => {
    if (store?.delivery_time) return store.delivery_time;
    if (store?.min_delivery_time) return `${store.min_delivery_time} min`;
    return null;
  }, [store?.delivery_time, store?.min_delivery_time]);

  const displayDistance = useMemo(
    () => formatDistance(store?.distance, isArabic),
    [store?.distance, isArabic]
  );

  const hasRating = useMemo(
    () =>
      store?.avg_rating != null &&
      typeof store.avg_rating === "number" &&
      store.avg_rating > 0,
    [store?.avg_rating]
  );

  const ratingCount = useMemo(
    () => formatRatingCount(store?.rating_count),
    [store?.rating_count]
  );

  const hasValidLocation = useMemo(
    () => isValidCoordinates(store?.latitude, store?.longitude),
    [store?.latitude, store?.longitude]
  );

  const coverImageUrl = useMemo(() => {
    if (imageError) return null;
    if (store?.cover_photo_full_url) return store.cover_photo_full_url;
    if (store?.cover_photo) {
      if (
        store.cover_photo.startsWith("http://") ||
        store.cover_photo.startsWith("https://")
      )
        return store.cover_photo;
      return `https://shellafood.com/storage/store/cover/${store.cover_photo}`;
    }
    return null;
  }, [store?.cover_photo_full_url, store?.cover_photo, imageError]);

  const logoUrl = useMemo(() => {
    if (logoError) return null;
    if (store?.logo_full_url) return store.logo_full_url;
    if (store?.logo) {
      if (store.logo.startsWith("http://") || store.logo.startsWith("https://"))
        return store.logo;
      return `https://shellafood.com/storage/store/${store.logo}`;
    }
    return null;
  }, [store?.logo_full_url, store?.logo, logoError]);

  const { isFavorite, isLoading: favoriteLoading, toggleFavorite } = useStoreFavorites(
    store?.id?.toString() || "",
    {
      name: displayName,
      nameAr: displayName,
      image: coverImageUrl || undefined,
      logo: logoUrl || undefined,
      type: displayType,
      typeAr: displayType,
      rating: (store?.avg_rating || 0).toString(),
    }
  );

  // ── handlers (unchanged) ───────────────────────────────────────────────

  const handleLocationClick = useCallback(() => {
    if (!hasValidLocation) return;
    setIsLocationModalOpen(true);
  }, [hasValidLocation]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: displayName,
      text: `${displayName} - ${displayType}`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [displayName, displayType]);

  const handleImageError = useCallback(() => setImageError(true), []);
  const handleLogoError = useCallback(() => setLogoError(true), []);

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(260px, 42vw, 520px)" }}
        role="banner"
        aria-label={isArabic ? `بطاقة متجر ${displayName}` : `Store banner for ${displayName}`}
      >
        {/* Cover photo */}
        <CoverImage
          url={coverImageUrl}
          name={displayName}
          isArabic={isArabic}
          onError={handleImageError}
        />

        {/* Gradient overlays */}
        <GradientOverlays />

        {/* Top-right actions */}
        <ActionButtons
          isArabic={isArabic}
          isFavorite={isFavorite}
          favoriteLoading={favoriteLoading}
          onShare={handleShare}
          onToggleFavorite={toggleFavorite}
          isOpen={store?.is_open_now ?? store?.open === 1}

        />

        {/* Bottom store info */}
        <StoreInfo
          logoUrl={logoUrl}
          displayName={displayName}
          displayType={displayType}
          isArabic={isArabic}
          hasRating={hasRating}
          rating={store?.avg_rating}
          ratingCount={ratingCount}
          deliveryTime={displayDeliveryTime}
          distance={displayDistance}
          hasValidLocation={hasValidLocation}
          onLogoError={handleLogoError}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Location Modal */}
      {hasValidLocation && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          storeName={displayName}
          latitude={parseFloat(String(store.latitude))}
          longitude={parseFloat(String(store.longitude))}
          address={store.address || undefined}
        />
      )}
    </>
  );
}

// ============================================================================
// SUB-COMPONENTS — redesigned UI, all props/logic unchanged
// ============================================================================

/** Cover photo or gradient fallback */
const CoverImage = memo(
  ({
    url,
    name,
    isArabic,
    onError,
  }: {
    url: string | null;
    name: string;
    isArabic: boolean;
    onError: () => void;
  }) => {
    if (url) {
      return (
        <div className="absolute inset-0">
          <Image
            src={url}
            alt={isArabic ? `صورة غلاف ${name}` : `Cover photo for ${name}`}
            fill
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            priority
            sizes="100vw"
            quality={getImageQuality("hero")}
            placeholder="blur"
            blurDataURL={getImageBlurDataURL()}
            onError={onError}
          />
        </div>
      );
    }
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0a1f15 0%, #065f46 50%, #047857 100%)",
        }}
        aria-hidden
      />
    );
  }
);

CoverImage.displayName = "CoverImage";

/** Layered gradient overlays for legibility */
const GradientOverlays = memo(() => (
  <>
    {/* strong bottom-up scrim */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
      }}
      aria-hidden
    />
    {/* subtle side vignette */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
      }}
      aria-hidden
    />
  </>
));

GradientOverlays.displayName = "GradientOverlays";

const glassBtn =
  "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-white/40 hover:bg-white/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40";

/** Inline-start in LTR (left) · inline-end in RTL (right) */
const OpenStatusPill = memo(
  ({ isOpen, isArabic }: { isOpen: boolean; isArabic: boolean }) => (
    <div
      role="status"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        isOpen
          ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-300"
          : "border-red-400/30 bg-red-500/20 text-red-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOpen ? "animate-pulse bg-emerald-400" : "bg-red-400"}`}
        aria-hidden
      />
      {isOpen ? (isArabic ? "مفتوح الآن" : "Open now") : isArabic ? "مغلق" : "Closed"}
    </div>
  ),
);

OpenStatusPill.displayName = "OpenStatusPill";

/** Status pill vs share/favorite — mirrored by `dir` + justify-between */
const ActionButtons = memo(
  ({
    isArabic,
    isFavorite,
    favoriteLoading,
    onShare,
    onToggleFavorite,
    isOpen,
  }: {
    isArabic: boolean;
    isFavorite: boolean;
    favoriteLoading: boolean;
    onShare: () => void;
    onToggleFavorite: () => void;
    isOpen: boolean;
  }) => (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-3 sm:inset-x-6 sm:top-6"
    >
      <OpenStatusPill isOpen={isOpen} isArabic={isArabic} />

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          className={`group ${glassBtn}`}
          aria-label={isArabic ? "مشاركة المتجر" : "Share store"}
        >
          <Share2 className="h-4 w-4 text-white drop-shadow-md transition-transform duration-200 group-hover:rotate-12 sm:h-5 sm:w-5" />
        </button>

        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton
            isFavorite={isFavorite}
            isLoading={favoriteLoading}
            onToggle={onToggleFavorite}
            size="sm"
            className={glassBtn}
            aria-label={
              isFavorite
                ? isArabic
                  ? "إزالة من المفضلة"
                  : "Remove from favorites"
                : isArabic
                  ? "إضافة إلى المفضلة"
                  : "Add to favorites"
            }
          />
        </div>

      </div>
    </div>
  )
);

ActionButtons.displayName = "ActionButtons";

/** Bottom info panel — logo, name, badges */
const StoreInfo = memo(
  ({
    logoUrl,
    displayName,
    displayType,
    isArabic,
    hasRating,
    rating,
    ratingCount,
    deliveryTime,
    distance,
    hasValidLocation,
    onLogoError,
    onLocationClick,
  }: {
    logoUrl: string | null;
    displayName: string;
    displayType: string;
    isArabic: boolean;
    hasRating: boolean;
    rating: number | undefined;
    ratingCount: number;
    deliveryTime: string | null;
    distance: string | null;
    hasValidLocation: boolean;
    onLogoError: () => void;
    onLocationClick: () => void;
  }) => (
    <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-6 sm:pb-7 md:px-8 md:pb-8">

      <div className="mx-auto max-w-7xl">
        <div
          className={`flex items-end gap-4 sm:gap-5 
            }`}
        >
          {/* Logo */}
          <StoreLogo
            logoUrl={logoUrl}
            displayName={displayName}
            isArabic={isArabic}
            onError={onLogoError}
          />

          {/* Name + meta */}
          <div
            className={`flex-1 min-w-0 ${isArabic ? "text-right" : "text-left"}`}
          >


            {/* Store name */}
            <h1
              className="text-white font-black leading-tight drop-shadow-xl mb-2 sm:mb-3"
              style={{
                fontSize: "clamp(1.3rem, 4vw, 2.75rem)",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {displayName}
            </h1>

            {/* Type label */}
            {displayType && (
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-white/60 sm:text-sm">
                {displayType}
              </p>
            )}

            {/* Meta badges */}
            <div className={`flex flex-wrap gap-2 `}>
              {/* Rating */}
              {hasRating && rating && (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md sm:text-sm"
                  style={{
                    background: "rgba(251,191,36,0.18)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    color: "#fde68a",
                  }}
                >
                  <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300 sm:h-4 sm:w-4" />
                  <span>{rating.toFixed(1)}</span>
                  {ratingCount > 0 && (
                    <span style={{ color: "rgba(253,230,138,0.7)" }}>
                      ({ratingCount}{ratingCount === 999 ? "+" : ""})
                    </span>
                  )}
                </div>
              )}

              {/* Delivery time */}
              {deliveryTime && (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md sm:text-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{deliveryTime}</span>
                </div>
              )}

              {/* Distance */}
              {distance && hasValidLocation && (
                <button
                  onClick={onLocationClick}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 sm:text-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                  aria-label={
                    isArabic
                      ? `المسافة: ${distance}. اضغط لفتح الخريطة`
                      : `Distance: ${distance}. Click to open map`
                  }
                >
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{distance}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

StoreInfo.displayName = "StoreInfo";

/** Circular logo with glassy border */
const StoreLogo = memo(
  ({
    logoUrl,
    displayName,
    isArabic,
    onError,
  }: {
    logoUrl: string | null;
    displayName: string;
    isArabic: boolean;
    onError: () => void;
  }) => {
    const sizeClass = "w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28";

    if (logoUrl) {
      return (
        <div
          className={`relative flex-shrink-0 ${sizeClass} rounded-2xl sm:rounded-3xl overflow-hidden ring-2 ring-white/30 shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95`}
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
          role="img"
          aria-label={isArabic ? `شعار ${displayName}` : `Logo for ${displayName}`}
        >
          <Image
            src={logoUrl}
            alt={isArabic ? `شعار ${displayName}` : `Logo for ${displayName}`}
            fill
            className="object-cover"
            quality={getImageQuality("thumbnail")}
            placeholder="blur"
            blurDataURL={getImageBlurDataURL(96, 96)}
            onError={onError}
            sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 112px"
          />
          {/* gloss overlay */}
          <div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
            }}
          />
        </div>
      );
    }

    return (
      <div
        className={`relative flex-shrink-0 ${sizeClass} rounded-2xl sm:rounded-3xl flex items-center justify-center`}
        style={{
          background: "rgba(255,255,255,0.12)",
          border: "2px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
        aria-hidden
      >
        <span
          className="font-black text-white"
          style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
        >
          {displayName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
);

StoreLogo.displayName = "StoreLogo";

export default memo(StoreHero);