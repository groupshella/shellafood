import { getPopularBrands } from "@/features/search/api/popular-brands";
import { PopularBrandsClient } from "./PopularBrandsClient";
import PopularBrandsSkeleton from "./skeleton";

export const PopularBrands = Object.assign(
    async function PopularBrands({ moduleId }: { moduleId?: string }) {
        if (!moduleId || Number.isNaN(Number(moduleId))) return null;

        const brands = await getPopularBrands(moduleId);
        if (brands.length === 0) return null;

        return <PopularBrandsClient brands={brands} />;
    },
    { skeleton: PopularBrandsSkeleton }
);
