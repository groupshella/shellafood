"use client";

import { useLanguage } from "@/providers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { CategoryDetail } from "../../types/store.details.types";
import { ArrowRight, Grid3x3, Star } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useMemo, useCallback, useState } from "react";
import { fadeInUp } from "../../lib/utils/animations";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface DepartmentCardProps {
  department: CategoryDetail;
  index?: number;
  className?: string; 
  categoryId?: number;
  storeId?: number;
}

function DepartmentCard({
  department,
  index = 0,
  className = "",
  categoryId,
  storeId,
}: DepartmentCardProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const displayName = useMemo(() => {
    return isArabic ? department.name_ar : department.name_en;
  }, [department, isArabic]);

  const handleClick = useCallback(() => {
    // Scroll to top immediately when clicking (before navigation)
    window.scrollTo({ top: 0, behavior: 'instant' });
    router.push(`/categories/${categoryId}/${storeId}/${department.id}`, { scroll: false });
  }, [router, categoryId, storeId, department.id]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir={direction}
      onClick={handleClick}
      className={`group cursor-pointer ${className}`}
    >
      <div className="relative h-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Department Image */}
        <div className="relative overflow-hidden h-48 sm:h-52 md:h-56 lg:h-60">
          {department.image_full_url ? (
            <Image
              src={department.image_full_url}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes={getImageSizes('card')}
              loading="lazy"
              quality={getImageQuality('card')}
              placeholder="blur"
              blurDataURL={getImageBlurDataURL()}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Grid3x3 className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Featured badge */}
          {department.featured === 1 && (
            <div className={`absolute top-3 ${isArabic ? 'right-3' : 'left-3'} px-3 py-1 rounded-full bg-yellow-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1`}>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
              <span>{isArabic ? "مميز" : "Featured"}</span>
            </div>
          )}

          {/* View arrow indicator */}
          <div className={`absolute bottom-3 ${isArabic ? 'left-3' : 'right-3'} w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}>
            <ArrowRight
              className={`w-5 h-5 text-gray-900 dark:text-white ${isArabic ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Department Info */}
        <div className="p-4 sm:p-5 md:p-6">
          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors ${isArabic ? 'text-right' : 'text-left'}`}>
            {displayName}
          </h3>
          
          {/* View products link */}
          <div className={`flex items-center gap-2 text-sm sm:text-base text-green-600 dark:text-green-400 font-semibold mt-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <span>{isArabic ? "عرض المنتجات" : "View Products"}</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
            />
          </div>
        </div>

        {/* Hover overlay effect */}
        <div
          className={`absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-2xl pointer-events-none ${isHovered ? 'opacity-100' : ''}`}
        />
      </div>
    </motion.div>
  );
}

  export default memo(DepartmentCard);

