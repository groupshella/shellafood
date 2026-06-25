import { getHyperMarketPopularBrands } from "@/features/hyper-market/StoreDetails/api/popular-brands";
import { PopularBrandsClient } from "./PopularBrandsClient";
import PopularBrandsSkeleton from "./skeleton";

export const PopularBrands = Object.assign(
    async function PopularBrands({ moduleId }: { moduleId: string }) {
        const brands = await getHyperMarketPopularBrands(moduleId);
        if (brands.length === 0) return null;

        return <PopularBrandsClient brands={brands} />;
    },
    { skeleton: PopularBrandsSkeleton },
);
