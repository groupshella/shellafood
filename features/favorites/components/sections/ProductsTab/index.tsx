import { getWishlist } from "@/features/favorites/api/favorites";
import { ProductsTabClient } from "./ProductsTabClient";
import ProductsTabSkeleton from "./skeleton";

export const ProductsTab = Object.assign(
    async function ProductsTab({ isArabic }: { isArabic: boolean }) {
        const data = await getWishlist({ isArabic });
        const products = data.item ?? [];
        return <ProductsTabClient products={products} isArabic={isArabic} />;
    },
    { skeleton: ProductsTabSkeleton }
);
