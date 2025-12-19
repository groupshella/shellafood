"use client";

import { useLanguage } from "@/providers";
import { Product } from "../../types/product.types";
import {
  Star,
  CheckCircle2,
  XCircle,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  Award,
  Plus,
  Minus,
  ShoppingCart,
  Package,
  Zap,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { memo, useMemo, useCallback } from "react";
import { useMobile } from "@/shared/hooks";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAddingToCart?: boolean;
}

function ProductInfo({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isAddingToCart = false,
}: ProductInfoProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
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

  const displayDescription = useMemo(() => {
    if (isArabic) {
      const arTranslation = product.translations?.find(
        (t: any) => t.locale === 'ar' && t.key === 'description'
      );
      return arTranslation?.value || product.description;
    }
    return product.description;
  }, [product, isArabic]);

  const displayUnit = useMemo(() => {
    if (isArabic) {
      const arTranslation = product.unit?.translations?.find(
        (t: any) => t.locale === 'ar' && t.key === 'unit'
      );
      return arTranslation?.value || product.unit?.unit || '';
    }
    return product.unit?.unit || '';
  }, [product.unit, isArabic]);

  const isAvailable = useMemo(() => {
    return product.availability?.is_available ?? (product.stock > 0 && product.status === 1);
  }, [product]);

  const hasDiscount = useMemo(() => {
    return product.original_price > 0 && product.original_price > product.price;
  }, [product]);

  const discountPercentage = useMemo(() => {
    if (!hasDiscount) return 0;
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  }, [hasDiscount, product]);

  const isLowStock = useMemo(() => {
    return isAvailable && product.stock > 0 && product.stock < 10;
  }, [isAvailable, product.stock]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) onQuantityChange(quantity - 1);
  }, [quantity, onQuantityChange]);

  const incrementQuantity = useCallback(() => {
    const maxQty = product.maximum_cart_quantity || product.stock;
    if (maxQty && quantity < maxQty) {
      onQuantityChange(quantity + 1);
    }
  }, [quantity, product.maximum_cart_quantity, product.stock, onQuantityChange]);

  // ============================================================================
  // TRANSLATIONS
  // ============================================================================

  const t = useMemo(() => ({
    reviews: isArabic ? "تقييم" : "reviews",
    askQuestion: isArabic ? "اسأل سؤال" : "Ask Question",
    per: isArabic ? "لكل" : "Per",
    inStock: isArabic ? "متوفر" : "In Stock",
    outOfStock: isArabic ? "نفد المخزون" : "Out of Stock",
    onlyLeft: isArabic ? "بقي" : "Only",
    left: isArabic ? "متاح" : "left",
    deliveryTime: isArabic ? "وقت التوصيل" : "Delivery Time",
    orderNow: isArabic ? "اطلب الآن، احصل عليه بحلول" : "Order now, get it by",
    quantity: isArabic ? "الكمية" : "Quantity",
    max: isArabic ? "الحد الأقصى" : "Max",
    addToCart: isArabic ? "إضافة للسلة" : "Add to Cart",
    buyNow: isArabic ? "اشتري الآن" : "Buy Now",
    adding: isArabic ? "جاري الإضافة..." : "Adding...",
    save: isArabic ? "وفر" : "Save",
    features: isArabic ? [
      { icon: Shield, text: "منتج أصلي 100%" },
      { icon: RefreshCw, text: "إرجاع سهل خلال 7 أيام" },
      { icon: CreditCard, text: "طرق دفع آمنة" },
      { icon: Award, text: "جودة مضمونة" },
    ] : [
      { icon: Shield, text: "100% Authentic Product" },
      { icon: RefreshCw, text: "Easy Returns within 7 days" },
      { icon: CreditCard, text: "Secure Payment Methods" },
      { icon: Award, text: "Quality Guaranteed" },
    ],
    description: isArabic ? "وصف المنتج" : "Product Description",
    sar: isArabic ? "ريال" : "SAR",
  }), [isArabic]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div dir={direction} className="space-y-6 sm:space-y-8">
      {/* Product Name - Hero Typography */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6">
          {displayName}
        </h1>

        {/* Rating & Reviews */}
        {product.avg_rating > 0 && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {product.avg_rating.toFixed(1)}
              </span>
            </div>
            {product.rating_count > 0 && (
              <button className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                ({product.rating_count > 999 ? "999+" : product.rating_count} {t.reviews})
              </button>
            )}
            {!isMobile && (
              <>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
                <button className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                  {t.askQuestion}
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* Price Section - Prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 rounded-2xl sm:rounded-3xl border-2 border-green-200 dark:border-green-800 shadow-lg"
      >
        <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-2">
          <span className="text-3xl sm:text-4xl md:text-5xl font-black text-green-600 dark:text-green-400">
            {product.price} {t.sar}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xl sm:text-2xl text-gray-400 dark:text-gray-500 line-through">
                {product.original_price} {t.sar}
              </span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg"
              >
                {t.save} {discountPercentage}%
              </motion.span>
            </>
          )}
        </div>
        {displayUnit && (
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            {t.per} {displayUnit}
          </p>
        )}
      </motion.div>

      {/* Stock Status - Clear Visual Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 ${
          isAvailable
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}
      >
        {isAvailable ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-green-700 dark:text-green-400 text-base sm:text-lg block">
                {t.inStock}
              </span>
              {isLowStock && (
                <span className="block text-sm sm:text-base text-orange-600 dark:text-orange-400 font-semibold mt-1">
                  {t.onlyLeft} {product.stock} {t.left}!
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="font-bold text-red-700 dark:text-red-400 text-base sm:text-lg">
              {t.outOfStock}
            </span>
          </div>
        )}
      </motion.div>

      {/* Delivery Info */}
      {product.availability?.estimated_preparation_time && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                {t.deliveryTime}: {product.availability.estimated_preparation_time}
              </p>
              {product.availability.next_available_time && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {t.orderNow} {product.availability.next_available_time}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quantity Selector - Modern Design */}
      <div>
        <label className="block text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {t.quantity}
        </label>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="px-5 sm:px-6 py-3 sm:py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label={isArabic ? "تقليل الكمية" : "Decrease quantity"}
            >
              <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <span className="px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-lg sm:text-xl min-w-[60px] sm:min-w-[80px] text-center text-gray-900 dark:text-white">
              {quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={incrementQuantity}
              disabled={
                (product.maximum_cart_quantity || product.stock) 
                  ? quantity >= (product.maximum_cart_quantity || product.stock) 
                  : false
              }
              className="px-5 sm:px-6 py-3 sm:py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label={isArabic ? "زيادة الكمية" : "Increase quantity"}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
          {(product.maximum_cart_quantity || product.stock) && (
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              {t.max}: {product.maximum_cart_quantity || product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons - Primary CTAs */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 sm:gap-4 pt-2`}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={onAddToCart}
          disabled={!isAvailable || isAddingToCart}
          className="flex-1 py-4 sm:py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 touch-manipulation min-h-[56px]"
        >
          {isAddingToCart ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Package className="w-6 h-6" />
              </motion.div>
              <span>{t.adding}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-6 h-6" />
              <span>{t.addToCart}</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={onBuyNow}
          disabled={!isAvailable || isAddingToCart}
          className={`${isMobile ? 'w-full' : 'px-8 sm:px-10'} py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 touch-manipulation min-h-[56px]`}
        >
          <Zap className="w-6 h-6" />
          <span>{t.buyNow}</span>
        </motion.button>
      </div>

      {/* Trust Badges - Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700"
      >
        {t.features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">{feature.text}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Description */}
      {displayDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            {t.description}
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {displayDescription}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default memo(ProductInfo);
