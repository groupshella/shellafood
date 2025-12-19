"use client";

import { useLanguage } from "@/providers";
import { Product } from "../../types/product.types";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import UnifiedProductCard from "../shared/UnifiedProductCard";
import { Item } from "../../types/department.types";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
  categoryId?: number;
  storeId?: number;
  departmentId?: number;
  onProductClick?: (productId: string) => void;
}

function RelatedProducts({
  products,
  categoryId,
  storeId,
  departmentId,
  onProductClick,
}: RelatedProductsProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  if (!products || products.length === 0) return null;

  // ============================================================================
  // DATA CONVERSION
  // ============================================================================

  const convertProductToItem = (product: Product): Item => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      category_id: product.category_id,
      brand_id: product.brand_id,
      category_ids: product.category_ids || [],
      variations: product.variations || [],
      add_ons: product.add_ons || [],
      attributes: product.attributes || [],
      choice_options: product.choice_options || [],
      p_margin: 0,
      price: product.price,
      cat_exclude: false,
      store_exclude: false,
      tax: product.tax,
      tax_class_id: null,
      profit_class_id: null,
      tax_cal: "exclude",
      tax_type: product.tax_type,
      discount: product.discount,
      discount_type: product.discount_type,
      available_time_starts: product.available_time_starts,
      available_time_ends: product.available_time_ends,
      veg: product.veg,
      status: product.status,
      store_id: product.store_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
      order_count: product.order_count,
      avg_rating: product.avg_rating,
      rating_count: product.rating_count,
      module_id: product.module_id,
      item_site_id: "",
      stock: product.stock,
      unit_id: product.unit_id,
      unit_type: product.unit_type,
      images: product.images || [],
      food_variations: product.food_variations || [],
      slug: product.slug,
      recommended: product.recommended,
      organic: product.organic,
      maximum_cart_quantity: product.maximum_cart_quantity,
      is_approved: product.is_approved,
      is_halal: product.is_halal,
      item_code: "",
      store_site_id: "",
      requires_customization: false,
      can_add_directly: true,
      presets: product.presets || [],
      module_type: product.module_type,
      store_name: product.store_name,
      is_campaign: 0,
      zone_id: 0,
      flash_sale: 0,
      store_discount: 0,
      schedule_order: false,
      delivery_time: product.availability?.estimated_preparation_time || "",
      free_delivery: false,
      unit: product.unit,
      min_delivery_time: 0,
      max_delivery_time: 0,
      common_condition_id: 0,
      is_basic: 0,
      is_prescription_required: 0,
      halal_tag_status: product.is_halal,
      original_price: product.original_price,
      highest_price_store_id: 0,
      highest_price_store_name: "",
      highest_price: 0,
      cheapest_available_store_id: 0,
      cheapest_available_store_name: "",
      cheapest_available_price: 0,
      delivery_store_id: product.store_id,
      total_available_stores: 1,
      has_multiple_stores: false,
      nutritions_name: [],
      allergies_name: [],
      generic_name: [],
      allergens: [],
      allergen_free: false,
      contains_nuts: false,
      contains_gluten: false,
      contains_dairy: false,
      contains_eggs: false,
      dietary: product.dietary,
      tags: product.tags || [],
      availability: product.availability,
      image_full_url: product.image_full_url,
      images_full_url: product.images_full_url,
      discounted_price: product.discounted_price,
      storage: product.storage,
      translations: product.translations,
      module: product.module as any,
      ecommerce_item_details: null,
      item_nutrition_value: null,
      allergies: [],
    };
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section dir={direction} className="mt-12 sm:mt-16 lg:mt-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
              {isArabic ? "منتجات ذات صلة" : "Related Products"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {isArabic ? `${products.length} منتج متاح` : `${products.length} products available`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {products.map((product, index) => {
          const item = convertProductToItem(product);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <UnifiedProductCard
                product={item}
                variant="default"
                onClick={onProductClick}
                storeId={storeId || product.store_id}
                storeName={product.store_name}
                categoryId={categoryId || product.module_id}
                index={index}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default memo(RelatedProducts);
