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
  Clock,
  Package,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
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

  // Get display description from translations
  const displayDescription = useMemo(() => {
    if (isArabic) {
      const arTranslation = product.translations?.find(
        (t: any) => t.locale === 'ar' && t.key === 'description'
      );
      return arTranslation?.value || product.description;
    }
    return product.description;
  }, [product, isArabic]);

  // Get unit display name
  const displayUnit = useMemo(() => {
    if (isArabic) {
      const arTranslation = product.unit?.translations?.find(
        (t: any) => t.locale === 'ar' && t.key === 'unit'
      );
      return arTranslation?.value || product.unit?.unit || '';
    }
    return product.unit?.unit || '';
  }, [product.unit, isArabic]);

  // Check availability
  const isAvailable = useMemo(() => {
    return product.availability?.is_available ?? (product.stock > 0 && product.status === 1);
  }, [product]);

  // Check if has discount
  const hasDiscount = useMemo(() => {
    return product.original_price > 0 && product.original_price > product.price;
  }, [product]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!hasDiscount) return 0;
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  }, [hasDiscount, product]);

  // Check low stock
  const isLowStock = useMemo(() => {
    return isAvailable && product.stock > 0 && product.stock < 10;
  }, [isAvailable, product.stock]);

  const decrementQuantity = () => {
    if (quantity > 1) onQuantityChange(quantity - 1);
  };

  const incrementQuantity = () => {
    const maxQty = product.maximum_cart_quantity || product.stock;
    if (maxQty && quantity < maxQty) {
      onQuantityChange(quantity + 1);
    }
  };

  const content = {
    ar: {
      reviews: "تقييم",
      askQuestion: "اسأل سؤال",
      per: "لكل",
      inStock: "متوفر",
      outOfStock: "نفد المخزون",
      onlyLeft: "بقي",
      left: "متاح",
      deliveryTime: "وقت التوصيل",
      orderNow: "اطلب الآن، احصل عليه بحلول",
      quantity: "الكمية",
      max: "الحد الأقصى",
      addToCart: "إضافة للسلة",
      buyNow: "اشتري الآن",
      features: [
        { icon: Shield, text: "منتج أصلي 100%" },
        { icon: RefreshCw, text: "إرجاع سهل خلال 7 أيام" },
        { icon: CreditCard, text: "طرق دفع آمنة" },
        { icon: Award, text: "جودة مضمونة" },
      ],
      description: "وصف المنتج",
      nutritionalInfo: "المعلومات الغذائية",
      ingredients: "المكونات",
      storage: "تعليمات التخزين",
    },
    en: {
      reviews: "reviews",
      askQuestion: "Ask Question",
      per: "Per",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      onlyLeft: "Only",
      left: "left",
      deliveryTime: "Delivery Time",
      orderNow: "Order now, get it by",
      quantity: "Quantity",
      max: "Max",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      features: [
        { icon: Shield, text: "100% Authentic Product" },
        { icon: RefreshCw, text: "Easy Returns within 7 days" },
        { icon: CreditCard, text: "Secure Payment Methods" },
        { icon: Award, text: "Quality Guaranteed" },
      ],
      description: "Product Description",
      nutritionalInfo: "Nutritional Information",
      ingredients: "Ingredients",
      storage: "Storage Instructions",
    },
  };

  const t = content[language];

  return (
    <div dir={direction} className="space-y-6">
      {/* Brand */}
      {displayDescription && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{displayDescription}</p>
      )}

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
        {displayName}
      </h1>

      {/* Rating & Reviews */}
      {product.avg_rating > 0 && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {product.avg_rating.toFixed(1)}
            </span>
          </div>
          {product.rating_count > 0 && (
            <button className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
              ({product.rating_count > 999 ? "999+" : product.rating_count} {t.reviews})
            </button>
          )}
          {!isMobile && (
            <>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
              <button className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 font-medium">
                <span>{t.askQuestion}</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-lg"
      >
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-green-600 dark:text-green-400">
            {product.price} {isArabic ? "ريال" : "SAR"}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg sm:text-xl text-gray-400 dark:text-gray-500 line-through">
                {product.original_price} {isArabic ? "ريال" : "SAR"}
              </span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 sm:px-3 py-1 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold shadow-md"
              >
                {isArabic ? "وفر" : "Save"} {discountPercentage}%
              </motion.span>
            </>
          )}
        </div>
        {displayUnit && (
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            {t.per} {displayUnit}
          </p>
        )}
      </motion.div>

      {/* Stock Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 ${
          isAvailable
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}
      >
        {isAvailable ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-green-700 dark:text-green-400 text-sm sm:text-base">
                {t.inStock}
              </span>
              {isLowStock && (
                <span className="block sm:inline sm:ml-2 text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-semibold">
                  ({t.onlyLeft} {product.stock} {t.left}!)
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="font-bold text-red-700 dark:text-red-400 text-sm sm:text-base">
              {t.outOfStock}
            </span>
          </div>
        )}
      </motion.div>

      {/* Delivery Info */}
      {product.availability?.estimated_preparation_time && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                {t.deliveryTime}: {product.availability.estimated_preparation_time}
              </p>
              {product.availability.next_available_time && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {t.orderNow} {product.availability.next_available_time}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          {t.quantity}
        </label>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <span className="px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[60px] text-center">
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
              className="px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
          {(product.maximum_cart_quantity || product.stock) && (
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t.max}: {product.maximum_cart_quantity || product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 sm:gap-4`}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={onAddToCart}
          disabled={!isAvailable || isAddingToCart}
          className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span>{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {t.addToCart}
            </>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={onBuyNow}
          disabled={!isAvailable || isAddingToCart}
          className={`${isMobile ? 'w-full' : 'px-6 sm:px-8'} py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
          {t.buyNow}
        </motion.button>
      </div>

      {/* Features/Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
        {t.features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">{feature.text}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Description */}
      {displayDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
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

