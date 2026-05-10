"use client";

import { useLanguage } from "@/providers";
import { useMemo, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useCart, useCartCount } from "@/shared/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Package, ShoppingCart } from "lucide-react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import Breadcrumbs from "../shared/Breadcrumbs";
import type { Product } from "../../types/product.types";
import { useMobile } from "@/shared/hooks";
import { NotificationDialog } from "@/shared/components";
import { NotificationState } from "@/features/profile/types/profile.types";

/** Matches item detail from product-details API (see server logs). */
export interface ProductTranslationRow {
  locale: string;
  key: string;
  value: string;
}

export interface ProductAvailabilityApi {
  is_available: boolean;
  is_available_now?: boolean;
  available_quantity?: number;
  stock_status?: string;
  estimated_preparation_time?: string | null;
  unavailable_until?: string | null;
  reason?: string | null;
  available_time_starts?: string | null;
  available_time_ends?: string | null;
  available_days?: string[];
  next_available_time?: string | null;
  seasonal?: boolean;
  season_start?: string | null;
  season_end?: string | null;
}

export interface StoreDetailsApi {
  id: number;
  name: string;
  logo?: string;
  logo_full_url?: string;
  slug?: string;
  module_id: number;
  zone_id: number;
}

export interface ModuleSummaryApi {
  id: number;
  module_name: string;
  module_type: string;
  thumbnail?: string;
  status?: string;
  stores_count?: number;
  icon_full_url?: string;
  thumbnail_full_url?: string;
}

export interface ProductDetailPayload {
  id: number;
  name: string;
  description: string;
  image: string;
  category_id: number;
  brand_id?: number;
  category_ids?: unknown[];
  variations?: unknown[];
  food_variations?: unknown[];
  add_ons?: unknown[];
  attributes?: unknown[];
  choice_options?: unknown[];
  price: number;
  cat_exclude?: boolean;
  store_exclude?: boolean;
  tax?: number;
  tax_class_id?: number | null;
  profit_class_id?: number | null;
  tax_cal?: string;
  tax_type?: string;
  discount?: number;
  discount_type?: string;
  veg?: number;
  status?: number;
  store_id: number;
  created_at?: string;
  updated_at?: string;
  order_count?: number;
  avg_rating?: number;
  rating_count?: number;
  module_id: number;
  item_site_id?: string;
  stock?: number;
  unit_id?: number | null;
  images?: string | unknown[];
  slug?: string;
  recommended?: number;
  organic?: number;
  maximum_cart_quantity?: number | null;
  is_approved?: number;
  is_halal?: number;
  store_name: string;
  is_campaign?: number;
  module_type?: string;
  zone_id?: number;
  flash_sale?: number;
  store_discount?: number;
  schedule_order?: boolean;
  min_delivery_time?: number;
  max_delivery_time?: number;
  original_price?: number;
  discounted_price?: number;
  availability?: ProductAvailabilityApi | null;
  store_details?: StoreDetailsApi | null;
  recommended_items?: unknown[];
  unit_type?: string | null;
  image_full_url?: string;
  images_full_url?: string[];
  has_variations?: boolean;
  reviews?: unknown[];
  translations?: ProductTranslationRow[];
  module?: ModuleSummaryApi | null;
  requires_customization?: boolean;
  can_add_directly?: boolean;
  unit?: unknown | null;
}

function translationValue(
  rows: ProductTranslationRow[] | undefined,
  locale: string,
  key: string
): string | undefined {
  return rows?.find((t) => t.locale === locale && t.key === key)?.value;
}

/** Cart payload uses food variations for food modules when present. */
function variationsForCart(p: ProductDetailPayload): unknown[] {
  if (Array.isArray(p.food_variations) && p.food_variations.length > 0) {
    return p.food_variations;
  }
  return Array.isArray(p.variations) ? p.variations : [];
}

interface ProductViewProps {
  product: ProductDetailPayload;
  departmentId?: number;
}

function ProductView({ product, departmentId }: ProductViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const { addToCart } = useCart();
  const isMobile = useMobile(768);
  const { count: cartCount } = useCartCount();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "success",
  });

  const displayName = useMemo(() => {
    if (isArabic) {
      const fromTranslations =
        translationValue(product.translations, "ar", "name") ||
        translationValue(product.translations, "ar", "title");
      if (fromTranslations) return fromTranslations;
    }
    return product.name;
  }, [product.name, product.translations, isArabic]);

  const isAvailable = useMemo(() => {
    return (
      product.availability?.is_available ??
      ((product.stock ?? 0) > 0 && (product.status ?? 0) === 1)
    );
  }, [product]);

  const storeLabel =
    product.store_details?.name?.trim() || product.store_name || (isArabic ? "المتجر" : "Store");

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/" },
      {
        label: product.module?.module_name || (isArabic ? "الأقسام" : "Categories"),
        href: product.module_id ? `/categories/${product.module_id}` : "/categories",
      },
      {
        label: storeLabel,
        href:
          product.store_id && product.module_id
            ? `/categories/${product.module_id}/${product.store_id}`
            : undefined,
      },
      { label: displayName },
    ],
    [product.module?.module_name, product.module_id, product.store_id, displayName, storeLabel, isArabic]
  );

  const productAsLegacy = product as unknown as Product;

  const handleAddToCart = useCallback(async () => {
    if (!product?.id) {
      setNotification({
        show: true,
        message: isArabic ? "خطأ: منتج غير صالح" : "Error: Invalid product",
        type: "error",
      });
      return;
    }

    if (!isAvailable) {
      setNotification({
        show: true,
        message: isArabic ? "المنتج غير متوفر حالياً" : "Product is currently unavailable",
        type: "error",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart({
        productId: product.id.toString(),
        storeId: product.store_id?.toString() || "",
        quantity,
        priceAtAdd: product.price,
        variation: variationsForCart(product),
        add_on_ids: product.add_ons,
        add_on_qtys: [],
      });

      if (result.success) {
        setNotification({
          show: true,
          message: isArabic ? "✓ تم الإضافة للسلة بنجاح" : "✓ Added to cart successfully",
          type: "success",
        });
      } else {
        setNotification({
          show: true,
          message: result.error || (isArabic ? "فشل في إضافة المنتج" : "Failed to add product"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({
        show: true,
        message: isArabic ? "حدث خطأ أثناء الإضافة للسلة" : "Error adding to cart",
        type: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, addToCart, isAvailable, isArabic]);

  const handleBuyNow = useCallback(async () => {
    if (!product?.id || !isAvailable) return;

    setIsAddingToCart(true);
    try {
      const result = await addToCart({
        productId: product.id.toString(),
        storeId: product.store_id?.toString() || "",
        quantity,
        priceAtAdd: product.price,
        variation: variationsForCart(product),
        add_on_ids: product.add_ons,
        add_on_qtys: [],
      });

      if (result.success) {
        router.push("/cart");
      } else {
        setNotification({
          show: true,
          message: result.error || (isArabic ? "فشل في إضافة المنتج" : "Failed to add product"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({
        show: true,
        message: isArabic ? "حدث خطأ" : "An error occurred",
        type: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, addToCart, isAvailable, router, isArabic]);

  const handleRelatedProductClick = useCallback(
    (productId: string) => {
      if (product.module_id && product.store_id && departmentId) {
        window.scrollTo({ top: 0, behavior: "instant" });
        router.push(`/categories/${product.module_id}/${product.store_id}/${departmentId}/${productId}`, {
          scroll: false,
        });
      }
    },
    [product.module_id, product.store_id, departmentId, router]
  );

  const handleShare = useCallback(async () => {
    const shareData = {
      title: displayName,
      text: `${displayName} — ${storeLabel}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotification({
          show: true,
          message: isArabic ? "تم نسخ الرابط" : "Link copied to clipboard",
          type: "success",
        });
      }
    } catch {
      setNotification({
        show: true,
        message: isArabic ? "حدث خطأ" : "An error occurred",
        type: "error",
      });
    }
  }, [displayName, storeLabel, isArabic]);

  if (!product?.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <Package className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              {isArabic ? "المنتج غير موجود" : "Product Not Found"}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
              {isArabic ? "المنتج الذي تبحث عنه غير موجود" : "The product you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
            >
              {isArabic ? "العودة" : "Go Back"}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const recommended = product.recommended_items;
  const hasRecommended = Array.isArray(recommended) && recommended.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={isArabic ? "رجوع" : "Go back"}
              >
                <ArrowLeft className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${isArabic ? "rotate-180" : ""}`} />
              </button>
              <h1 className="flex-1 text-center text-sm font-bold text-gray-900 dark:text-white line-clamp-1 px-2">
                {displayName}
              </h1>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={isArabic ? "مشاركة" : "Share"}
              >
                <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 lg:mb-8"
          >
            <Breadcrumbs items={breadcrumbItems} />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-4 lg:top-8 self-start"
          >
            <ProductGallery product={productAsLegacy} storeId={product.store_id?.toString()} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <ProductInfo
              product={productAsLegacy}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isAddingToCart={isAddingToCart}
            />
          </motion.div>
        </div>

        {hasRecommended && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 sm:mt-16 lg:mt-20"
          >
            <RelatedProducts
              products={recommended as Product[]}
              categoryId={product.module_id}
              storeId={product.store_id}
              departmentId={departmentId}
              onProductClick={handleRelatedProductClick}
            />
          </motion.section>
        )}
      </div>
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => router.push("/cart")}
            className={`fixed ${isArabic ? "left-4" : "right-4"} bottom-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all duration-300 hover:shadow-green-500/50 hover:scale-110`}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <motion.span
              key={cartCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
      <NotificationDialog
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ show: false, message: "", type: "success" })}
        isArabic={isArabic}
      />
    </div>
  );
}

export default memo(ProductView);
