"use client";

import { useLanguage } from "@/providers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { ZoneDataModule } from "../../types/module.types";
import { fadeInUp } from "@/lib/utils/categories/animations";

interface CategoryCardProps {
  module: ZoneDataModule;
}

function CategoryCard({ module }: CategoryCardProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [iconError, setIconError] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent double clicks and multiple navigations
    if (isNavigating) return;

    e.preventDefault();
    setIsNavigating(true);


    // Small delay for visual feedback, then navigate
    setTimeout(() => {
      router.push(`/categories/${module.id}?moduleName=${module.module_name}`, { scroll: true });
    }, 150);
  }, [router, module.id, isNavigating]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      dir={direction}
      onClick={handleClick}
      className={`group relative cursor-pointer ${isNavigating ? 'pointer-events-none opacity-75' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover gradient */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 blur transition-opacity duration-300 rounded-xl sm:rounded-2xl ${isNavigating ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} />

      <div className={`relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-2 transition-all duration-300 h-full ${isNavigating
        ? 'border-green-500 dark:border-green-500'
        : 'border-gray-200 dark:border-gray-700 group-hover:border-transparent'
        }`}>

        {/* Thumbnail */}
        <div className="relative h-32 sm:h-40 md:h-48 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-700">
          {module.thumbnail ? (
            <Image
              src={`https://shellafood.com/storage/module/${module.thumbnail}`}
              alt={module.module_name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="eager"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Module Icon */}

          <div className="absolute top-2 sm:top-3 md:top-4 rtl:right-2 sm:rtl:right-3 md:rtl:right-4 ltr:left-2 sm:ltr:left-3 md:ltr:left-4 
              w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
              rounded-lg sm:rounded-xl md:rounded-xl
              bg-white/20 dark:bg-white/10 backdrop-blur-md
              flex items-center justify-center 
              border border-white/30 dark:border-white/20
              overflow-hidden shadow-lg dark:shadow-black/30
              transition-all duration-300
              group-hover:scale-110 group-hover:bg-white/30 dark:group-hover:bg-white/15">
            <Store className="w-6 h-6 text-white dark:text-gray-300" />

          </div>


          {/* Stores count */}
          {module.stores_count > 0 && (
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 rtl:left-2 sm:rtl:left-3 md:rtl:left-4 ltr:right-2 sm:ltr:right-3 md:ltr:right-4 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-[10px] sm:text-xs font-bold shadow">
              {module.stores_count}+ {isArabic ? "متجر" : "Stores"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="rtl:text-right ltr:text-left">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {module.module_name}
          </h3>

          {(() => {
            // Get description from translations if available, otherwise use default
            const description = isArabic
              ? module.translations?.find(t => t.locale === 'ar' && t.key === 'description')?.value
              : module.translations?.find(t => t.locale === 'en' && t.key === 'description')?.value;

            const displayDescription = description || module.description || '';
            const cleanDescription = displayDescription.replace(/<[^>]*>?/gm, "").trim();

            return cleanDescription ? (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {cleanDescription}
              </p>
            ) : null;
          })()}
        </div>

        {/* Arrow */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 rtl:left-3 sm:rtl:left-4 md:rtl:left-6 ltr:right-3 sm:ltr:right-4 md:ltr:right-6">
          <ArrowRight
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-all rtl:rotate-180 ${isNavigating
              ? 'text-green-500 dark:text-green-400'
              : 'text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400'
              } ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
          />
        </div>

        {/* Loading overlay when navigating */}
        {isNavigating && (
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl sm:rounded-2xl">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(CategoryCard);
