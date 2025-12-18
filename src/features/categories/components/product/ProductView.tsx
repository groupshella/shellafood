"use client";

import { useLanguage } from "@/providers";
import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/shared/hooks";
import { useToast } from "@/shared/components/ui";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Zap, 
  Star, 
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  Shield,
  Award
} from "lucide-react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import Breadcrumbs from "../shared/Breadcrumbs";
import type { Product } from "../../types/product.types";
import { useMobile } from "@/shared/hooks";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface ProductViewProps {
  product: Product;
  categoryId?: number;
  storeId?: number;
  departmentId?: number;
}

function ProductView({
  product,
  categoryId,
  storeId,
  departmentId,
}: ProductViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const isMobile = useMobile(768);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/" },
      {
        label: product.module?.module_name || (isArabic ? "الأقسام" : "Categories"),
        href: product.module_id ? `/categories/${product.module_id}` : "/categories",
      },
      {
        label: product.store_name || (isArabic ? "المتجر" : "Store"),
        href: product.store_id && product.module_id 
          ? `/categories/${product.module_id}/${product.store_id}` 
          : undefined,
      },
      {
        label: displayName,
      },
    ],
    [product, displayName, isArabic]
  );

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    if (!product.store_id) {
      showToast(
        isArabic ? "خطأ: لا يوجد متجر محدد" : "Error: No store specified",
        "error"
      );
      return;
    }

    if (!isAvailable) {
      showToast(
        isArabic ? "المنتج غير متوفر حالياً" : "Product is currently unavailable",
        "warning"
      );
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart({
        productId: product.id.toString(),
        storeId: product.store_id.toString(),
        quantity,
        productName: product.name,
        productNameAr: product.translations?.find((t: any) => t.locale === 'ar' && t.key === 'name')?.value || product.name,
        productImage: product.image_full_url || product.image,
        priceAtAdd: product.price,
        storeName: product.store_name || "",
        storeNameAr: "",
        stock: product.stock,
      });

      if (result.success) {
        showToast(
          isArabic ? "تم الإضافة للسلة بنجاح" : "Added to cart successfully",
          "success"
        );
      } else if (result.requiresClearCart) {
        showToast(
          isArabic
            ? "لديك منتجات من متجر آخر في السلة"
            : "You have items from a different store in your cart",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast(
        isArabic ? "حدث خطأ أثناء الإضافة للسلة" : "Error adding to cart",
        "error"
      );
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, addToCart, isAvailable, isArabic, showToast]);

  const handleBuyNow = useCallback(async () => {
    if (!product) return;
    if (!product.store_id) return;
    if (!isAvailable) return;

    setIsAddingToCart(true);
    try {
      const result = await addToCart({
        productId: product.id.toString(),
        storeId: product.store_id.toString(),
        quantity,
        productName: product.name,
        productNameAr: product.translations?.find((t: any) => t.locale === 'ar' && t.key === 'name')?.value || product.name,
        productImage: product.image_full_url || product.image,
        priceAtAdd: product.price,
        storeName: product.store_name || "",
        storeNameAr: "",
        stock: product.stock,
      });

      if (result.success) {
        router.push("/cart");
      } else if (result.requiresClearCart) {
        showToast(
          isArabic
            ? "لديك منتجات من متجر آخر في السلة"
            : "You have items from a different store in your cart",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast(
        isArabic ? "حدث خطأ" : "An error occurred",
        "error"
      );
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, addToCart, isAvailable, router, isArabic, showToast]);

  const handleRelatedProductClick = useCallback(
    (productId: string) => {
      if (product.module_id && product.store_id && departmentId) {
        router.push(`/categories/${product.module_id}/${product.store_id}/${departmentId}/${productId}`);
      }
    },
    [product, departmentId, router]
  );

  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir={direction}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir={direction}>
      {/* Mobile Header - Sticky */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-center text-sm font-bold text-gray-900 dark:text-white line-clamp-1 px-2">
              {displayName}
            </h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs - Hidden on mobile */}
        {!isMobile && (
          <Breadcrumbs items={breadcrumbItems} className="mb-6 lg:mb-8" />
        )}

        {/* Main Product Layout */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductGallery 
              product={product} 
              storeId={product.store_id?.toString()} 
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ProductInfo
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isAddingToCart={isAddingToCart}
            />
          </motion.div>
        </div>

        {/* Related Products */}
        {product.recommended_items && product.recommended_items.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 sm:mt-12"
          >
            <RelatedProducts
              products={product.recommended_items}
              categoryId={product.module_id}
              storeId={product.store_id}
              departmentId={departmentId}
              onProductClick={handleRelatedProductClick}
            />
          </motion.section>
        )}
      </div>
    </div>
  );
}

export default ProductView;

