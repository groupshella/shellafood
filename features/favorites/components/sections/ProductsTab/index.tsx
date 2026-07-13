import { getFavoriteProducts } from "@/features/favorites/api/favorites";
import { ProductsTabClient } from "./ProductsTabClient";
import ProductsTabSkeleton from "./skeleton";

export const ProductsTab = Object.assign(
    async function ProductsTab() {
        const products = await getFavoriteProducts();
        return <ProductsTabClient products={products} />;
    },
    { skeleton: ProductsTabSkeleton }
);
