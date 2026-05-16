"use client";

import { useLanguage } from "@/providers";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useState, useMemo, useCallback } from "react";
import { Product } from "../../types/product.types";
import { FavoriteButton } from "@/shared/components/ui";
import { useMobile, useProductFavorites } from "@/shared/hooks";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface ProductGalleryProps {
  product: Product;
  storeId?: string;
}

function ProductGallery({ product, storeId }: ProductGalleryProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const isMobile = useMobile(768);
  // ============================================================================
  // DATA EXTRACTION
  // ============================================================================

  const displayName = useMemo(() => {
    if (isArabic) {
      const arTranslation = product.translations?.find(
        (t: any) => t.locale === 'ar' && t.key === 'name'
      );
      return arTranslation?.value || product.name;
    }
    return product.name;
  }, [product, isArabic]);

  const allImages = useMemo(() => {
    const seen = new Set<string>();
    const add = (url: string | undefined) => {
      if (url && typeof url === 'string' && url.startsWith('http') && !seen.has(url)) {
        seen.add(url);
        return url;
      }
      return null;
    };
    const images: string[] = [];
    if (product.image) {
      const u = add(product.image);
      if (u) images.push(u);
    }

    return images;
  }, [product]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const selectedImage = allImages[selectedImageIndex] || "";

  const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
    useProductFavorites(product.id.toString(), {
      name: product.name,
      nameAr: product.translations?.find((t: any) => t.locale === 'ar' && t.key === 'name')?.value || product.name,
      image: product.image_full_url || product.image,
      price: product.price,
      originalPrice: product.original_price > 0 ? product.original_price : undefined,
      unit: product.unit?.unit || '',
      unitAr: product.unit?.translations?.find((t: any) => t.locale === 'ar' && t.key === 'unit')?.value || product.unit?.unit || '',
      storeId: storeId || product.store_id?.toString(),
    });

  const displayBadge = useMemo(() => {
    if (product.discount > 0 && product.discount_type) {
      const discountValue = product.discount_type === 'percent'
        ? `${product.discount}%`
        : `${product.discount} ${isArabic ? 'ريال' : 'SAR'}`;
      return isArabic ? `${discountValue} خصم` : `${discountValue} OFF`;
    }
    return null;
  }, [product, isArabic]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePrevious = useCallback(() => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  }, [allImages.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Main Image Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl"
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={displayName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={getImageQuality('hero')}
            placeholder="blur"
            blurDataURL={getImageBlurDataURL()}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-sm sm:text-base">{isArabic ? "لا توجد صورة" : "No Image"}</div>
          </div>
        )}

        {/* Discount Badge */}
        {displayBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} z-20`}
          >
            <div className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold shadow-2xl">
              {displayBadge}
            </div>
          </motion.div>
        )}

        {/* Favorite Button */}
        <div className={`absolute top-4 z-20 ${isArabic ? "left-4" : "right-4"}`}>
          <FavoriteButton
            isFavorite={isFavorite}
            isLoading={favoriteLoading}
            onToggle={toggleFavorite}
            size="md"
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl hover:scale-110 transition-transform"
          />
        </div>

        {/* Navigation Arrows - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} z-20 w-12 h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl flex items-center justify-center hover:bg-white transition-colors touch-manipulation`}
              aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
            >
              <ChevronLeft className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${isArabic ? "rotate-180" : ""}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-4" : "right-4"} z-20 w-12 h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl flex items-center justify-center hover:bg-white transition-colors touch-manipulation`}
              aria-label={isArabic ? "الصورة التالية" : "Next image"}
            >
              <ChevronRight className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${isArabic ? "rotate-180" : ""}`} />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className={`absolute bottom-4 ${isArabic ? "right-4" : "left-4"} z-20 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium`}>
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Zoom Button - Desktop Only */}
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsZoomed(!isZoomed)}
            className={`absolute bottom-4 ${isArabic ? "left-4" : "right-4"} z-20 px-4 py-2 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-sm font-bold hover:shadow-xl transition-all shadow-lg flex items-center gap-2`}
          >
            <ZoomIn className="w-4 h-4" />
            <span>{isArabic ? "تكبير" : "Zoom"}</span>
          </motion.button>
        )}
      </motion.div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
          {allImages.slice(0, 5).map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleThumbnailClick(i)}
              className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === i
                  ? "border-green-500 dark:border-green-400 ring-2 ring-green-500/50 scale-105 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:scale-105"
                }`}
              aria-label={`${displayName} ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${displayName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, 20vw"
                quality={getImageQuality('thumbnail')}
                placeholder="blur"
                blurDataURL={getImageBlurDataURL()}
              />
              {selectedImageIndex === i && (
                <div className="absolute inset-0 bg-green-500/20" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);
