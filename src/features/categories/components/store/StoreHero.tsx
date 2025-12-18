"use client";

import { useLanguage } from "@/providers";
import type { StoreDetails } from "../../types/store.details.types";
import Image from "next/image";
import { Star, Clock, MapPin, Share2, ExternalLink } from "lucide-react";
import { memo, useMemo, useState, useCallback } from "react";
import { FavoriteButton } from "@/shared/components/ui";
import { useStoreFavorites } from "@/shared/hooks";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";
import LocationModal from "./LocationModal";

interface StoreHeroProps {
  store: StoreDetails;
}

function StoreHero({ store }: StoreHeroProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // ✅ Safe data extraction with fallbacks
  const displayName = useMemo(() => {
    if (!store?.name) return isArabic ? "متجر" : "Store";
    
    if (isArabic && store?.translations?.length) {
      const translation = store.translations.find(
        t => t?.locale === 'ar' && t?.key === 'name' && t?.value
      );
      return translation?.value || store.name;
    }
    return store.name;
  }, [store, isArabic]);

  const displayType = useMemo(() => {
    if (!store?.module?.module_name) return "";
    
    if (isArabic && store.module?.translations?.length) {
      const translation = store.module.translations.find(
        t => t?.locale === 'ar' && t?.key === 'module_name' && t?.value
      );
      return translation?.value || store.module.module_name;
    }
    return store.module.module_name;
  }, [store?.module, isArabic]);

  // ✅ Safe delivery time extraction
  const displayDeliveryTime = useMemo(() => {
    if (store?.delivery_time) return store.delivery_time;
    if (store?.delivery?.delivery_time_range) return store.delivery.delivery_time_range;
    return null;
  }, [store?.delivery_time, store?.delivery?.delivery_time_range]);

  // ✅ Safe distance formatting with validation
  const displayDistance = useMemo(() => {
    if (!store?.distance || typeof store.distance !== 'number' || store.distance <= 0) {
      return null;
    }
    const km = store.distance / 1000;
    return `${km.toFixed(1)} ${isArabic ? "كم" : "km"}`;
  }, [store?.distance, isArabic]);

  // ✅ Safe rating extraction
  const hasRating = useMemo(() => {
    return store?.avg_rating != null && 
           typeof store.avg_rating === 'number' && 
           store.avg_rating > 0;
  }, [store?.avg_rating]);

  const ratingCount = useMemo(() => {
    if (!store?.rating_count || store.rating_count <= 0) return 0;
    return store.rating_count > 999 ? 999 : store.rating_count;
  }, [store?.rating_count]);

  // ✅ Safe coordinates validation
  const hasValidLocation = useMemo(() => {
    if (!store?.latitude || !store?.longitude) return false;
    const lat = parseFloat(String(store.latitude));
    const lng = parseFloat(String(store.longitude));
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  }, [store?.latitude, store?.longitude]);

  const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
    useStoreFavorites(store?.id?.toString() || "", {
      name: displayName,
      nameAr: displayName,
      image: store?.cover_photo_full_url || undefined,
      logo: store?.logo_full_url || undefined,
      type: displayType,
      typeAr: displayType,
      rating: (store?.avg_rating || 0).toString(),
    });

  // ✅ Safe location handler - opens modal instead of direct navigation
  const handleLocationClick = useCallback(() => {
    if (!hasValidLocation) return;
    setIsLocationModalOpen(true);
  }, [hasValidLocation]);

  // ✅ Share functionality
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
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      }
    } catch (error) {
      // User cancelled or error occurred
      console.error('Error sharing:', error);
    }
  }, [displayName, displayType]);

  // ✅ Image error handlers
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleLogoError = useCallback(() => {
    setLogoError(true);
  }, []);

  const coverImageUrl = store?.cover_photo_full_url && !imageError 
    ? store.cover_photo_full_url 
    : null;

  const logoUrl = store?.logo_full_url && !logoError 
    ? store.logo_full_url 
    : null;

  return (
    <div 
      dir={direction} 
      className="relative h-[260px] min-[375px]:h-[300px] sm:h-96 md:h-[32rem] lg:h-[36rem] overflow-hidden rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl lg:rounded-b-[2.5rem] shadow-xl sm:shadow-2xl"
      role="banner"
      aria-label={isArabic ? `بطاقة متجر ${displayName}` : `Store card for ${displayName}`}
    >
      {/* Cover Image - Mobile Optimized */}
      {coverImageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={coverImageUrl}
            alt={isArabic ? `صورة غلاف ${displayName}` : `Cover photo for ${displayName}`}
            fill
            className="object-cover scale-105 sm:transition-transform sm:duration-700 sm:ease-out sm:hover:scale-100"
            priority
            sizes="100vw"
            quality={getImageQuality('hero')}
            placeholder="blur"
            blurDataURL={getImageBlurDataURL()}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div 
          className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" 
          aria-hidden="true" 
        />
      )}

      {/* Mobile-Optimized Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/96 via-black/75 sm:via-black/70 via-black/50 sm:via-black/40 to-transparent"
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/25 sm:from-black/20 via-transparent to-black/35 sm:to-black/30"
        aria-hidden="true"
      />

      {/* Store Info Overlay - Mobile First Design */}
      <div className="absolute bottom-0 left-0 right-0 p-3 min-[375px]:p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 pb-safe">
        <div className="container mx-auto max-w-7xl px-3 min-[375px]:px-4 sm:px-5 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 min-[375px]:gap-4 sm:gap-6 md:gap-7 lg:gap-8">
            {/* Store Logo - Mobile Optimized */}
            {logoUrl ? (
              <div 
                className="relative group w-14 h-14 min-[375px]:w-18 min-[375px]:h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg min-[375px]:rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden flex-shrink-0 sm:transition-all sm:duration-300 sm:hover:scale-105 sm:hover:shadow-2xl active:scale-95"
                role="img"
                aria-label={isArabic ? `شعار ${displayName}` : `Logo for ${displayName}`}
              >
                {/* Glassmorphism Border - Mobile Optimized */}
                <div className="absolute inset-0 rounded-lg min-[375px]:rounded-xl sm:rounded-2xl md:rounded-3xl border-2 sm:border-[3px] border-white/40 backdrop-blur-md sm:backdrop-blur-xl bg-white/5 shadow-[0_4px_16px_0_rgba(0,0,0,0.4)] sm:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]" />
                <div className="absolute inset-[1px] sm:inset-[2px] rounded-lg min-[375px]:rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20" />
                
                {/* Logo Image */}
                <div className="relative w-full h-full p-0.5 min-[375px]:p-1 sm:p-1.5 md:p-2">
                  <Image
                    src={logoUrl}
                    alt={isArabic ? `شعار ${displayName}` : `Logo for ${displayName}`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-md min-[375px]:rounded-lg sm:rounded-xl md:rounded-2xl"
                    quality={getImageQuality('thumbnail')}
                    placeholder="blur"
                    blurDataURL={getImageBlurDataURL(96, 96)}
                    onError={handleLogoError}
                    sizes="(max-width: 640px) 56px, (max-width: 768px) 96px, 128px"
                  />
                </div>
                
                {/* Shine Effect - Desktop Only */}
                <div className="hidden sm:block absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              <div 
                className="relative w-14 h-14 min-[375px]:w-18 min-[375px]:h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg min-[375px]:rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0 sm:transition-all sm:duration-300 sm:hover:scale-105 active:scale-95"
                aria-hidden="true"
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 rounded-lg min-[375px]:rounded-xl sm:rounded-2xl md:rounded-3xl backdrop-blur-md sm:backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border-2 border-white/30 shadow-[0_4px_16px_0_rgba(0,0,0,0.4)] sm:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]" />
                <span className="relative text-white text-lg min-[375px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black drop-shadow-lg">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Store Info - Mobile Optimized Typography */}
            <div className="flex-1 min-w-0 text-white space-y-2 min-[375px]:space-y-2.5 sm:space-y-3 md:space-y-4 w-full">
              <h1 
                className="text-xl min-[375px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-0 leading-[1.1] break-words drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] tracking-tight"
                id="store-name"
              >
                {displayName}
              </h1>
              
              {/* Meta Information - Mobile Optimized Pills */}
              <div className="flex flex-wrap items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 md:gap-4">
                {/* Rating Badge - Mobile Optimized */}
                {hasRating && (
                  <div 
                    className="group inline-flex items-center gap-1.5 min-[375px]:gap-2 px-2.5 min-[375px]:px-3 sm:px-4 py-1.5 min-[375px]:py-2 rounded-xl min-[375px]:rounded-2xl backdrop-blur-md sm:backdrop-blur-xl bg-gradient-to-r from-yellow-500/30 via-yellow-400/25 to-yellow-500/30 border border-yellow-300/40 shadow-[0_2px_12px_rgba(251,191,36,0.4)] sm:shadow-[0_4px_20px_rgba(251,191,36,0.3)] sm:hover:shadow-[0_6px_30px_rgba(251,191,36,0.4)] sm:transition-all sm:duration-300 sm:hover:scale-105 active:scale-95 touch-manipulation"
                    role="group"
                    aria-label={isArabic ? `التقييم: ${store.avg_rating.toFixed(1)}` : `Rating: ${store.avg_rating.toFixed(1)}`}
                  >
                    <Star 
                      className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-5 sm:h-5 fill-yellow-300 text-yellow-300 flex-shrink-0 drop-shadow-lg sm:animate-pulse" 
                      aria-hidden="true"
                    />
                    <span className="font-black text-sm min-[375px]:text-base sm:text-lg text-yellow-50 drop-shadow-md">
                      {store.avg_rating.toFixed(1)}
                    </span>
                    {ratingCount > 0 && (
                      <span className="text-[10px] min-[375px]:text-xs sm:text-sm font-semibold text-yellow-100/90 drop-shadow-sm">
                        ({ratingCount}{ratingCount === 999 ? "+" : ""})
                      </span>
                    )}
                  </div>
                )}

                {/* Delivery Time - Mobile Optimized */}
                {displayDeliveryTime && (
                  <div 
                    className="inline-flex items-center gap-1.5 min-[375px]:gap-2 px-2.5 min-[375px]:px-3 sm:px-4 py-1.5 min-[375px]:py-2 rounded-xl min-[375px]:rounded-2xl backdrop-blur-md sm:backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg sm:hover:bg-white/15 sm:transition-all sm:duration-300 touch-manipulation"
                    role="text"
                    aria-label={isArabic ? `وقت التوصيل: ${displayDeliveryTime}` : `Delivery time: ${displayDeliveryTime}`}
                  >
                    <Clock className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white/90" aria-hidden="true" />
                    <span className="font-semibold text-xs min-[375px]:text-sm sm:text-base text-white drop-shadow-md whitespace-nowrap">{displayDeliveryTime}</span>
                  </div>
                )}

                {/* Distance - Mobile Optimized Button */}
                {displayDistance && (
                  <button
                    onClick={handleLocationClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLocationClick();
                      }
                    }}
                    className="group inline-flex items-center gap-1.5 min-[375px]:gap-2 px-2.5 min-[375px]:px-3 sm:px-4 py-1.5 min-[375px]:py-2 rounded-xl min-[375px]:rounded-2xl backdrop-blur-md sm:backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg sm:hover:bg-white/20 sm:hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent sm:transition-all sm:duration-200 touch-manipulation min-h-[44px]"
                    aria-label={isArabic ? `المسافة: ${displayDistance}. اضغط لفتح الخريطة` : `Distance: ${displayDistance}. Click to open map`}
                  >
                    <MapPin className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white/90 sm:group-hover:text-white sm:transition-colors" aria-hidden="true" />
                    <span className="font-semibold text-xs min-[375px]:text-sm sm:text-base text-white drop-shadow-md whitespace-nowrap">{displayDistance}</span>
                    <ExternalLink className="w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 sm:w-4 sm:h-4 opacity-70 sm:group-hover:opacity-100 sm:group-hover:translate-x-0.5 sm:transition-all" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              {/* Share Button */}
              <button
                onClick={handleShare}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleShare();
                  }
                }}
                className="group relative w-9 h-9 min-[375px]:w-10 min-[375px]:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl backdrop-blur-xl bg-white/15 hover:bg-white/25 active:bg-white/35 border border-white/30 hover:border-white/40 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 touch-manipulation"
                aria-label={isArabic ? "مشاركة المتجر" : "Share store"}
              >
                <Share2 className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
                <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/20 scale-0 active:scale-100 opacity-0 active:opacity-100 transition-all duration-200" />
              </button>

              {/* Favorite Button */}
              <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                <FavoriteButton
                  isFavorite={isFavorite}
                  isLoading={favoriteLoading}
                  onToggle={toggleFavorite}
                  size="sm"
                  className="w-9 h-9 min-[375px]:w-10 min-[375px]:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl backdrop-blur-xl bg-white/15 hover:bg-white/25 active:bg-white/35 border border-white/30 hover:border-white/40 shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 touch-manipulation"
                  aria-label={isFavorite 
                    ? (isArabic ? "إزالة من المفضلة" : "Remove from favorites")
                    : (isArabic ? "إضافة إلى المفضلة" : "Add to favorites")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {hasValidLocation && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          storeName={displayName}
          latitude={parseFloat(String(store.latitude))}
          longitude={parseFloat(String(store.longitude))}
          address={store.address}
        />
      )}
    </div>
  );
}

export default memo(StoreHero);

