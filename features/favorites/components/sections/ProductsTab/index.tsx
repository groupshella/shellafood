import { getFavoriteProducts } from "@/features/favorites/api/favorites";
import { isArabicLocale } from "@/shared/lib/locale";
import { ProductsTabClient } from "./ProductsTabClient";
import ProductsTabSkeleton from "./skeleton";

export const ProductsTab = Object.assign(
    async function ProductsTab() {
        const isArabic = await isArabicLocale();
        const products = await getFavoriteProducts(isArabic ? "ar" : "en");
        return <ProductsTabClient products={products} isArabic={isArabic} />;
    },
    { skeleton: ProductsTabSkeleton }
);
