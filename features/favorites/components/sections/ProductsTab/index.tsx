import { getWishlist } from "@/features/favorites/api/favorites";
import { ProductsTabClient } from "./ProductsTabClient";
import ProductsTabSkeleton from "./skeleton";

export const ProductsTab = Object.assign(
    async function ProductsTab() {
        const data = await getWishlist();
        const products = data.item ?? [];
        console.log(products);
        return <ProductsTabClient products={products} />;
    },
    { skeleton: ProductsTabSkeleton }
);
