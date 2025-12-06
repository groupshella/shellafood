"use client";

import { useLanguage } from "@/providers";
import { useMemo, useState, useCallback } from "react";
import { Product } from "../../types/category.types";
import { Store } from "../../types/category.types";
import { useRouter } from "next/navigation";
import { useCart } from "@/shared/hooks";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import Breadcrumbs from "../shared/Breadcrumbs";
import { navigateToProductFromContext } from "../../lib/utils/navigation";
import { decodeParam } from "../../lib/utils/url";
import { 
	findProductBySlug, 
	findStoreBySlug, 
	findStoreById, 
	getRelatedProducts 
} from "../../lib/helpers/testData";

interface ProductViewProps {
  categorySlug: string;
  storeSlug: string;
  departmentSlug: string;
  productSlug: string;
}

function ProductView({
  categorySlug,
  storeSlug,
  departmentSlug,
  productSlug,
}: ProductViewProps) {
  // Call all hooks first (hooks rules - must be called in same order)
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Decode URL params
  const decodedProductSlug = useMemo(() => decodeParam(productSlug), [productSlug]);
  const decodedStoreSlug = useMemo(() => decodeParam(storeSlug), [storeSlug]);

  // Find product by slug
  const product = useMemo(() => findProductBySlug(decodedProductSlug), [decodedProductSlug]);

  // Find store by slug or by product's storeId
  const store = useMemo(() => {
    const foundStore = findStoreBySlug(decodedStoreSlug);
    if (!foundStore && product?.storeId) {
      // If store not found by slug, try to find by product's storeId
      return findStoreById(product.storeId);
    }
    return foundStore;
  }, [decodedStoreSlug, product?.storeId]);

  // Get related products from the same store
  const relatedProducts = useMemo(() => {
    if (!product || !product.storeId) return [];
    return getRelatedProducts(product.id, product.storeId, 6);
  }, [product]);
  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/" },
      {
        label: isArabic ? "الأقسام" : "Categories",
        href: "/categories",
      },
      {
        label: categorySlug || "",
        href: categorySlug ? `/categories/${categorySlug}` : undefined,
      },
      {
        label: storeSlug || "",
        href:
          categorySlug && storeSlug
            ? `/categories/${categorySlug}/${storeSlug}`
            : undefined,
      },
      {
        label: departmentSlug || "",
        href:
          categorySlug && storeSlug && departmentSlug
            ? `/categories/${categorySlug}/${storeSlug}/${departmentSlug}`
            : undefined,
      },
      {
        label:
          product ? (isArabic && product.nameAr ? product.nameAr : product.name) : productSlug,
      },
    ],
    [categorySlug, storeSlug, departmentSlug, product, isArabic]
  );

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    if (!product.storeId && !store?.id) {
      return;
    }

    const storeId = product.storeId || store?.id;
    if (!storeId) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        storeId: storeId,
        quantity,
        productName: product.name,
        productNameAr: product.nameAr,
        productImage: product.image,
        priceAtAdd: typeof product.price === "number" ? product.price : 0,
        storeName: store?.name || "",
        storeNameAr: store?.nameAr,
        storeLogo: store?.logo || undefined,
        stock: product.stockQuantity,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, store, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart().then(() => {
      router.push("/cart");
    });
  }, [handleAddToCart, router]);

  const handleRelatedProductClick = useCallback(
    (productId: string) => {
      const relatedProduct = relatedProducts.find((p) => p.id === productId);
      if (relatedProduct) {
        navigateToProductFromContext(
          router,
          relatedProduct,
          categorySlug,
          storeSlug,
          departmentSlug
        );
      }
    },
    [relatedProducts, categorySlug, storeSlug, departmentSlug, router]
  );

  // Handle product not found (after all hooks are called)
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isArabic ? "المنتج غير موجود" : "Product Not Found"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isArabic ? "المنتج الذي تبحث عنه غير موجود" : "The product you're looking for doesn't exist."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Gallery */}
          <ProductGallery product={product} storeId={store?.id} />

          {/* Product Info */}
          <ProductInfo
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            categorySlug={categorySlug}
            storeSlug={storeSlug}
            departmentSlug={departmentSlug}
            onProductClick={handleRelatedProductClick}
          />
        )}
      </div>
    </div>
  );
}

export default ProductView;

