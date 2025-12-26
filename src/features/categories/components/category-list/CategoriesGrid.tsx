"use client";

import { useLanguage } from "@/providers";
import { motion } from "framer-motion";
import { memo } from "react";
import { ZoneDataModule } from "../../types/module.types";
import CategoryCard from "../category-details/CategoryCard";
import { staggerContainer } from "../../lib/utils/animations";

interface CategoriesGridProps {
  modules: ZoneDataModule[];
}

function CategoriesGrid({ modules }: CategoriesGridProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  if (!modules || modules.length === 0) {
    return null;
  }

  return (
    <motion.div
      dir={direction}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
    >
      {modules.map((module, index) => (
        <CategoryCard
          key={index}
          module={module}
        />
      ))}
    </motion.div>
  );
}

export default memo(CategoriesGrid);
