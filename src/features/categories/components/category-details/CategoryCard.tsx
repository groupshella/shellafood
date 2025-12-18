"use client";

import { useLanguage } from "@/providers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
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

  const handleClick = useCallback(() => {
    // ✅ Safer routing: use id or module_type
    router.push(`/categories/${module.id}`);
  }, [router, module.id]);

  return ( 
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      dir={direction}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* Hover gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 rounded-2xl" />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 group-hover:border-transparent transition-all duration-300 h-full">

        {/* Thumbnail */}
        <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
          {module.thumbnail_full_url ? (
            <Image
              src={module.thumbnail_full_url}
              alt={module.module_name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="eager"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-16 h-16 text-gray-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Module Icon */}
          <div className="absolute top-4 rtl:right-4 ltr:left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            {/* {module.icon_full_url ? (
              <Image
                src={module.icon_full_url}
                alt={`${module.module_name} icon`}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : ( */}
              <Store className="w-6 h-6 text-white" />
          
          </div>

          {/* Stores count */}
          {module.stores_count > 0 && (
            <div className="absolute bottom-4 rtl:left-4 ltr:right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 text-xs font-bold shadow">
              {module.stores_count}+ {isArabic ? "متجر" : "Stores"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="rtl:text-right ltr:text-left">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
            {module.module_name}
          </h3>

          {module.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {module.description.replace(/<[^>]*>?/gm, "")}
            </p>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight
          className="absolute bottom-6 rtl:left-6 ltr:right-6 w-5 h-5 text-gray-400 group-hover:text-green-500 rtl:rotate-180 transition-all"
        />
      </div>
    </motion.div>
  );
}

export default memo(CategoryCard);
