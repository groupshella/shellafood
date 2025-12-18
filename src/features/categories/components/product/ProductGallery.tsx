"use client";

import { useLanguage } from "@/providers";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useState, useMemo } from "react";
import { Product } from "../../types/product.types";
import { FavoriteButton } from "@/shared/components/ui";
import { useProductFavorites } from "@/shared/hooks";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface ProductGalleryProps {
  product: Product;
  storeId?: string;
}

function ProductGallery({ product, storeId }: ProductGalleryProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  // Get display name from translations
  const displayName = useMemo(() => {
    if (isArabic) {
      const arTranslation = product.translations?.find(
        (t: any) => t.locale === 'ar' && t.key === 'name'
      );
      return arTranslation?.value || product.name;
    }
    return product.name;
  }, [product, isArabic]);

  // Get all product images
  const allImages = useMemo(() => {
    const images: string[] = [];
    if (product.image_full_url) images.push(product.image_full_url);
    else if (product.image) images.push(product.image);
    
    if (product.images_full_url && Array.isArray(product.images_full_url) && product.images_full_url.length > 0) {
      images.push(...product.images_full_url);
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      images.push(...product.images.map((img: any) => img.img || img));
    }
    return images;
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(
    allImages[0] || ""
  );

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

  // Get discount badge
  const displayBadge = useMemo(() => {
    if (product.discount > 0 && product.discount_type) {
      const discountValue = product.discount_type === 'percent' 
        ? `${product.discount}%` 
        : `${product.discount} ${isArabic ? 'ريال' : 'SAR'}`;
      return isArabic ? `${discountValue} خصم` : `${discountValue} OFF`;
    }
    return null;
  }, [product, isArabic]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg"
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={displayName}
            fill
            className="object-cover"
            priority
            sizes={getImageSizes('hero')}
            quality={getImageQuality('hero')}
            placeholder="blur"
            blurDataURL={getImageBlurDataURL()}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-sm sm:text-base">{isArabic ? "لا توجد صورة" : "No Image"}</div>
          </div>
        )}

        {/* Badges */}
        {displayBadge && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`absolute top-3 sm:top-4 ${isArabic ? "right-3 sm:right-4" : "left-3 sm:left-4"} z-10`}
          >
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-500 text-white text-xs sm:text-sm font-bold shadow-xl">
              {displayBadge}
            </div>
          </motion.div>
        )}

        {/* Favorite */}
        <div className={`absolute top-3 sm:top-4 z-10 ${isArabic ? "left-3 sm:left-4" : "right-3 sm:right-4"}`}>
          <FavoriteButton
            isFavorite={isFavorite}
            isLoading={favoriteLoading}
            onToggle={toggleFavorite}
            size={"md"}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
          />
        </div>

        {/* Zoom button - Hidden on mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute bottom-3 sm:bottom-4 ${isArabic ? "left-3 sm:left-4" : "right-3 sm:right-4"} px-3 sm:px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs sm:text-sm font-bold hover:shadow-xl transition-all shadow-lg flex items-center gap-2`}
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">
              {isArabic ? "تكبير" : "Zoom"}
            </span>
          </motion.button>
        
      </motion.div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {allImages.slice(0, 5).map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedImage(img)}
              className={`relative h-16 sm:h-20 md:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === img
                  ? "border-green-500 dark:border-green-400 ring-2 ring-green-500/50 scale-105"
                  : "border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400"
              }`}
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
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);

